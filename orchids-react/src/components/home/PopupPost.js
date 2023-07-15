import React, { useEffect } from 'react'
import PostPage from '../post_page/PostPage';

export default function PopupPost({ PostData, setIsPopup }) {

    useEffect(() => {
        // Turn off scroll bar when the component is mounted
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '0';
        // Restore scroll bar when the component is unmounted
        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = null;
        };
    }, []);

    const stylePopup = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100vh',
        zIndex: '1',
        backgroundColor: 'rgba(0,0,0,.5)',
        overflowY: 'scroll',
    }

    return (
        <div style={stylePopup}>
            <div>
                <i className="fa-solid fa-xmark fa-2xl" 
                onClick={() => setIsPopup(false)}
                style={
                    {
                        position: 'fixed',
                        top: '7rem',
                        right: '9rem',
                        color: 'black',
                        cursor: 'pointer',
                    }
                }
                ></i>
                <PostPage PostData={PostData}/>
            </div>
        </div>
    )
}
