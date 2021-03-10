import React from 'react'
import { formatDistance } from 'date-fns'

import Alert from '@material-ui/lab/Alert'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import EmailIcon from '@material-ui/icons/Email'
import IdentityIcon from '@material-ui/icons/PermIdentity'
import { SvgIconComponent } from '@material-ui/icons'

import { useUploadAvatarMutation } from '../../generated/types'
import useStyles from './Profile.style'

type FileChange = React.ChangeEvent<HTMLInputElement>
type MyListProps = { icon: SvgIconComponent; text: string | Date }

const MyList: React.FC<MyListProps> = ({ icon: Icon, text }) => (
	<ListItem>
		<ListItemIcon>
			<Icon />
		</ListItemIcon>
		<ListItemText>{text}</ListItemText>
	</ListItem>
)

type Props = {
	user: IUser | null
	setCurrentUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

const Profile: React.FC<Props> = ({ user, setCurrentUser }) => {
	const fileInput = React.useRef<HTMLInputElement>(null)

	const [progress, setProgress] = React.useState<number>(0)
	const [file, setFile] = React.useState<File | null>(null)
	const [upload, { loading, data, error }] = useUploadAvatarMutation({
		onCompleted: (file) => {
			setCurrentUser((initVal) => {
				if (!initVal) return null
				return {
					...initVal,
					avatar: file.uploadAvatar.filename,
				}
			})

			if (!fileInput.current) return
			fileInput.current.value = ''
		},
		onError: () => {},
	})

	React.useEffect(() => {
		if (!file || loading) return

		let abort: any

		upload({
			variables: { file },
			context: {
				fetchOptions: {
					useUpload: true,
					onProgress: (ev: ProgressEvent) => {
						setProgress((ev.loaded / ev.total) * 100)
					},
					onAbortPossible: (abortHandler: any) => {
						abort = abortHandler
					},
				},
			},
		})

		return () => {
			if (!abort) return
			abort()
		}
	}, [file])

	const onFileChange = ({ currentTarget: { files } }: FileChange) => {
		if (!files) return
		setFile(files[0])
	}

	const classes = useStyles()

	if (!user)
		return <Typography variant="h5">You have to be logged in first</Typography>

	return (
		<Box>
			<Grid container>
				<Grid item>
					<Card>
						<CardHeader
							avatar={
								<Avatar
									alt={user.name}
									src={`http://localhost:4200/img/${user.avatar}`}
								/>
							}
							title={user.name}
							subheader={`Joined ${formatDistance(
								new Date(user.joined),
								new Date(),
							)} ago`}
						/>
						<CardContent>
							<Box>
								{error ? (
									<Alert className={classes.alert} severity="error">
										{error.message}
									</Alert>
								) : (
									''
								)}
								{data?.uploadAvatar ? (
									<Alert className={classes.alert}>
										Uploaded {data.uploadAvatar.filename}
									</Alert>
								) : (
									''
								)}
							</Box>
							<List>
								<MyList icon={IdentityIcon} text={user.id} />
								{user.email ? (
									<MyList icon={EmailIcon} text={user.email} />
								) : (
									''
								)}
							</List>
						</CardContent>
						<CardActions>
							<Button
								disabled={loading}
								color="primary"
								variant="contained"
								component="label"
							>
								Upload PFP
								<input
									ref={fileInput}
									onChange={onFileChange}
									type="file"
									accept="image/*"
									hidden
								/>
							</Button>
							{loading ? (
								<Typography variant="body1">{Math.ceil(progress)}%</Typography>
							) : (
								''
							)}
						</CardActions>
					</Card>
				</Grid>
			</Grid>
		</Box>
	)
}

export default Profile
