import React from 'react';
import {
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import {
    Close as CloseIcon,
} from '@mui/icons-material';

const MediaSidebar = ({
    sharedMedia,
    currentTheme,
    themes,
    setShowMediaSidebar,
}) => {
    return (
        <Box
            sx={{
                width: 300,
                bgcolor: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(10px)",
                borderLeft: "1px solid rgba(0,0,0,0.1)",
                height: "100%",
                overflow: "auto",
                p: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h6" sx={{ color: themes[currentTheme].primary }}>
                    Shared Media
                </Typography>
                <IconButton onClick={() => setShowMediaSidebar(false)}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box
                sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}
            >
                {sharedMedia.map((media, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: "relative",
                            paddingTop: "100%",
                            borderRadius: "10px",
                            overflow: "hidden",
                            cursor: "pointer",
                            "&:hover": {
                                transform: "scale(1.05)",
                                transition: "transform 0.2s ease",
                            },
                        }}
                    >
                        {media.fileType === "image" ? (
                            <img
                                src={media.content}
                                alt={media.fileName}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: themes[currentTheme].message.received,
                                }}
                            >
                                <Typography variant="caption" sx={{ textAlign: "center" }}>
                                    {media.fileName}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default MediaSidebar; 