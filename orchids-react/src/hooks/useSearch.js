import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, Input } from "@mui/material";
import { useState } from "react"

export default function useSearch() {

    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');

    function handleOpen() {
        setOpen(true);
    }

    function handleChange(event) {
        setSearchTerm(event.target.value)
    }

    function getComponent() {
        return (
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth sx={{
                "& .MuiDialog-container": {
                    alignItems: "flex-start"
                },
                "& .MuiDialog-paper": {
                    borderRadius: 4,
                }
            }}>
                <DialogContent>
                    <input placeholder="Type to start searching" style={{ border: 'none', outline: 'none', fontSize: "1rem", width: "100%" }} onChange={handleChange} />
                    {
                        searchTerm && (
                            <Box mt={2}>
                                <Divider />
                                <CircularProgress/>
                            </Box>
                        )
                    }
                </DialogContent>
            </Dialog>
        )
    }

    return [getComponent, handleOpen]
}