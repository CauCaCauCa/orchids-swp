import { Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, useMediaQuery, Typography, IconButton } from '@mui/material';
import Quill from 'quill';
import React, { useContext, useEffect, useRef, useState } from 'react'
import EditImageOverlay from '../../common/EditImageOverlay';
import IconImage from '../../common/IconImage';
import { FileUploader } from 'react-drag-drop-files';
import { createTeamPost } from '../../../api/teamAPI';
import { NotificationContext } from '../../../context/NotificationContext';
import { TeamPostContext } from '../../../context/team/TeamPostsContextProvider';

export default function CreateTeamPost({ open, setOpen, teamEmail }) {

    // used solely to load the quill. without this, quill loads on close only
    const [isDialogOpen, setIsDialogOpen] = useState(open);
    const { addPost } = useContext(TeamPostContext);

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const isMobile = useMediaQuery('(max-width: 768px)');

    // subcomponents
    const [openSelectImage, setOpenSelectImage] = useState(false);

    // post components
    const [content, setContent] = useState('');
    const [previewUrl, setPreviewUrl] = useState("/img/user-placeholder.png");
    const [title, setTitle] = useState('');

    // handles
    const handleEditImage = () => {
        setOpenSelectImage(true);
    }

    const handleSubmit = () => {
        addPost(title, content, previewUrl);
        setOpen(false);
    }

    const handleFileChange = (files) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        }
        reader.readAsDataURL(files);
    }

    useEffect(() => {
        if (open && editorRef.current) {
            quillRef.current = new Quill(
                editorRef.current, {
                theme: 'snow',
                placeholder: 'Enter your text...'
            });
            quillRef.current.on('text-change', () => {
                setContent(quillRef.current.root.innerHTML);
            });
        }

        return () => {
            if (quillRef.current) {
                quillRef.current.off('text-change')
                quillRef.current = null;
            }
        }
    }, [isDialogOpen, open])

    useEffect(() => {
        setIsDialogOpen(open);
    }, [open])

    useEffect(() => {
        return () => {
            setContent('');
            setPreviewUrl("/img/user-placeholder.png");
            setTitle('');
        }
    }, [isDialogOpen])

    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)} fullScreen={isMobile} maxWidth>
                <DialogTitle display="flex" alignItems="center">
                    <Typography variant='h6' fontWeight={900} flexGrow={1}>Tạo bài đăng</Typography>
                    <IconButton onClick={() => setOpen(false)}><i class="fa fa-times" aria-hidden="true"></i></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box position="relative" mb={2}>
                        <EditImageOverlay handle={handleEditImage} sx={{ width: "750px", height: "300px" }}>
                            <IconImage src={previewUrl} alt="preview" sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
                        </EditImageOverlay>
                    </Box>
                    <Box display="flex" flexDirection="column" gap="1">
                        <TextField fullWidth label="Tiêu đề" variant="outlined" onChange={(e) => setTitle(e.target.value)} value={title} sx={{ mb: "1rem" }} />
                        <div ref={editorRef} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleSubmit}>Đăng</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openSelectImage} onClose={() => setOpenSelectImage(false)}>
                <Box sx={{ width: "100%", height: "100%" }}>
                    <FileUploader
                        multiple={false}
                        handleChange={handleFileChange}
                        types={['png', 'jpg', 'jpeg']}
                    />
                </Box>
                <DialogActions>
                    <Button onClick={() => setOpenSelectImage(false)}>Finish</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
