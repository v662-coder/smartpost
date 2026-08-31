import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { Box, Typography, Chip } from '@mui/material';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const STATUS_LABELS = {
    todo: "To Do",
    ongoing: "Ongoing",
    completed: "Completed",
};

const TaskStatus = ({ onDrop, status, count = 0 }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'TASK_ITEM',
        drop: (item) => onDrop(item.taskId, status),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div ref={drop} style={{ opacity: isOver ? 0.8 : 1, transition: "opacity 0.15s ease" }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                }}
            >
                {status === "completed" ? <CheckCircleIcon sx={{ fontSize: "40px", color: "white" }} /> : null}
                {status === "ongoing" ? <RocketLaunchIcon sx={{ fontSize: "40px", color: "white" }} /> : null}
                {status === "todo" ? <BallotOutlinedIcon sx={{ fontSize: "40px", color: "white" }} /> : null}

                <Typography sx={{ color: "white", fontWeight: 700, fontSize: "16px" }}>
                    {STATUS_LABELS[status] || status}
                </Typography>
                <Chip
                    label={`${count} task${count === 1 ? "" : "s"}`}
                    size="small"
                    sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
                />
            </Box>
        </div>
    );
};

TaskStatus.propTypes = {
    onDrop: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
    count: PropTypes.number,
};

export default TaskStatus