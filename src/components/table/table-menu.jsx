import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Popover, Button, MenuList, MenuItem, Box, Typography, } from "@mui/material";
import Iconify from "src/components/iconify";

const ActionPopover = ({ actions = [] }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setAnchorEl(null);
    };

    const handleAction = (action) => {
        if (action && typeof action === 'function') {
            action();
        }
        handleClose();
    };

    return (
        <Box sx={{ display: 'inline-flex' }}>
            <Button
                onClick={handleOpen}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'inherit',
                    '& .icon': {
                        color: 'inherit',
                    },
                    '&:hover': {
                        bgcolor: 'action.hover',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify
                        icon={isOpen ? "eva:menu-2-fill" : "eva:menu-fill"}
                        width={20}
                        height={20}
                        sx={{ color: 'inherit' }}
                    />
                    <Typography variant="button" sx={{ color: 'inherit' }}>
                        Menu
                    </Typography>
                </Box>
                <Iconify
                    icon={isOpen ? "eva:chevron-up-fill" : "eva:chevron-down-fill"}
                    width={20}
                    height={20}
                    sx={{
                        transition: 'transform 0.2s ease-in-out',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(90deg)',
                        color: 'inherit'
                    }}
                />
            </Button>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 150,
                        mt: 1,
                        overflow: 'inherit',
                        boxShadow: (theme) => theme.shadows[2],
                        border: (theme) => `solid 1px ${theme.palette.divider}`,
                    },
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuList sx={{ p: 0 }}>
                    {actions.length > 0 ? (
                        actions.map((action, index) => (
                            <MenuItem
                                key={index}
                                onClick={() => handleAction(action.method)}
                                sx={{
                                    py: 1,
                                    px: 2,
                                    color: 'inherit',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    width: '100%',
                                }}>
                                    {action.icon && (
                                        <Iconify
                                            icon={action.icon}
                                            width={20}
                                            height={20}
                                            sx={{
                                                color: 'inherit',
                                                opacity: 0.8
                                            }}
                                        />
                                    )}
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'inherit',
                                            flexGrow: 1
                                        }}
                                    >
                                        {action.label}
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled sx={{ py: 1, px: 2 }}>
                            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                                No actions available
                            </Typography>
                        </MenuItem>
                    )}
                </MenuList>
            </Popover>
        </Box>
    );
};

ActionPopover.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            icon: PropTypes.string,
            method: PropTypes.func.isRequired,
        })
    ).isRequired,
};

export default ActionPopover;