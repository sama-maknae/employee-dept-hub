import React, {useState} from "react";
import {Box, Button, TextField} from "@mui/material";
import FormDialog from "@/components/common/FormDialog";
import DepartmentForm from "@/components/containers/department/DepartmentForm";

interface DepartmentTableToolbarProps {
    search: string;
    setSearch: (value: string) => void;
    onDepartmentCreated?: () => void;
    hasData?: boolean;
}

const DepartmentTableToolbar: React.FC<DepartmentTableToolbarProps> = ({
                                                                           search,
                                                                           setSearch,
                                                                           onDepartmentCreated,
                                                                           hasData = false,
                                                                       }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleDepartmentCreatedLocal = () => {
        if (onDepartmentCreated) onDepartmentCreated();
        handleClose();
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

    return (
        <Box
            mb={2}
            display="flex"
            flexDirection={{xs: 'column', sm: 'row'}}
            alignItems="center"
            gap={2}
            justifyContent="flex-end"
        >
            <FormDialog
                open={open}
                onClose={handleClose}
                title="Add Department"
                maxWidth="sm"
                fullWidth
            >
                <DepartmentForm onDepartmentCreated={handleDepartmentCreatedLocal}/>
            </FormDialog>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                sx={{width: {xs: '100%', sm: 240}, minWidth: {sm: 240}}}
            >
                Add Department
            </Button>
            {hasData && (
                <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Search by name or description"
                    value={search}
                    onChange={handleSearchChange}
                    sx={{width: {xs: '100%', sm: 240}, minWidth: {sm: 240}}}
                    inputProps={{"aria-label": "search by name or description"}}
                />
            )}
        </Box>
    );
};

export default DepartmentTableToolbar;