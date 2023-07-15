import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const { createContext, useState } = require("react");

export const ConfirmContext = createContext({})

export default function ConfirmContextProvider({ children }) {

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [confirmRunner, setConfirmRunner] = useState(() => () => { });

    function handleConfirm() {
        confirmRunner();
        setOpen(false);
    }

    function openConfirm(title, confirmRunner) {
        setTitle(title);
        setConfirmRunner(() => confirmRunner);
        setOpen(true);
    }

    return (
        <ConfirmContext.Provider value={{ openConfirm }}>
            {children}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Warning</DialogTitle>
                <DialogContent>
                    {title}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirm}>Confirm</Button>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </ConfirmContext.Provider>
    )
}