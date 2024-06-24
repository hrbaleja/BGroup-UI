import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';



export default function TaskItem({ task, onEdit, onDelete, onComplete }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        pl: 2,
        pr: 1,
        py: 1,
        '&:not(:last-of-type)': {
          borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
        },
        ...(task.status && {
          color: 'text.disabled',
          textDecoration: 'line-through',
        }),
      }}
    >
      <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
        {task.title} - {task.description.slice(0, 30)} {task.description.length > 30 ? '...' : ''}
      </Typography>
      

      <IconButton onClick={() => onComplete(task._id, !task.status)} color={task.status ? "success" : "default"}>
        <Iconify icon={task.status ? "eva:checkmark-circle-2-fill" : "eva:checkmark-circle-2-outline"} />
      </IconButton>

      <IconButton onClick={() => onEdit(task)} sx={{ color: 'primary.light' }}>
        <Iconify icon="eva:edit-fill" />
      </IconButton>

      <IconButton onClick={() => onDelete(task._id)} sx={{ color: 'error.main' }}>
        <Iconify icon="eva:trash-2-outline" />
      </IconButton>
    </Stack>
  );
}

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};