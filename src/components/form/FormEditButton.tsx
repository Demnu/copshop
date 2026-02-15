import { Edit as EditIcon } from '@mui/icons-material'
import { Button } from '@mui/material'
interface FormEditButtonProps {
  handleEditToggle: () => void
}
export const FormEditButton = (props: FormEditButtonProps) => {
  const { handleEditToggle } = props
  return (
    <Button
      variant="contained"
      startIcon={<EditIcon />}
      onClick={handleEditToggle}
      size="large"
    >
      Edit Profile
    </Button>
  )
}
