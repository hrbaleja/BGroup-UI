// import React from 'react';

// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import Select from '@mui/material/Select';
// // import Switch from '@mui/material/Switch';
// import MenuItem from '@mui/material/MenuItem';
// import TextField from '@mui/material/TextField';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';


// const IncomeModals = ({
//     openCreateModal,
//     handleCloseCreateModal,
//     handleCreateIncome,
//     transactions,
//     newIncome,
//     setNewIncome,
//     openEditModal,
//     handleCloseEditModal,
//     handleUpdateIncome,
//     incomeToEdit,
//     setIncomeToEdit,
// }) => {
//     return (
//         <>
//             {/* Create Income Modal */}
//             <Dialog open={openCreateModal} onClose={handleCloseCreateModal}>
//                 <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
//                     Create Income
//                 </DialogTitle>
//                 <DialogContent>
//                     <FormControl fullWidth sx={{ margin: "0.5rem 0" }}>
//                         <InputLabel>Select Transaction</InputLabel>
//                         <Select
//                             value={newIncome.transactionId}
//                             label="Select Transaction"
//                             onChange={(e) => setNewIncome({ ...newIncome, transactionId: e.target.value })}
//                             fullWidth
//                         >
//                             {transactions.map((transaction) => (
//                                 <MenuItem key={transaction._id} value={transaction._id}>
//                                     {transaction.company.name}-{transaction.user.name}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                     <TextField
//                         margin="dense"
//                         label="Profit"
//                         type="number"
//                         fullWidth
//                         value={newIncome.profit}
//                         onChange={(e) => setNewIncome({ ...newIncome, profit: e.target.value })}
//                     />

//                     <TextField
//                         margin="dense"
//                         label="Shared Profit"
//                         type="number"
//                         fullWidth
//                         value={newIncome.sharedProfit}
//                         onChange={(e) => setNewIncome({ ...newIncome, sharedProfit: e.target.value })}
//                     />

//                     <TextField
//                         margin="dense"
//                         label="Final Amount"
//                         type="number"
//                         fullWidth
//                         value={newIncome.finalAmount}
//                         onChange={(e) => setNewIncome({ ...newIncome, finalAmount: e.target.value })}
//                     />
//                 </DialogContent>

//                 <DialogActions>
//                     <Button onClick={handleCloseCreateModal}>Cancel</Button>
//                     <Button onClick={handleCreateIncome}>Create</Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Edit Income Modal
//             <Dialog open={openEditModal} onClose={handleCloseEditModal}>
//                 <DialogTitle>Edit Income</DialogTitle>
//                 <DialogContent>
//                     {incomeToEdit && (
//                         <>
//                             <TextField
//                                 autoFocus
//                                 margin="dense"
//                                 label="Transaction ID"
//                                 type="text"
//                                 fullWidth
//                                 value={incomeToEdit.transactionId}
//                                 onChange={(e) =>
//                                     setIncomeToEdit({
//                                         ...incomeToEdit,
//                                         transactionId: e.target.value,
//                                     })
//                                 }
//                             />

//                             <TextField
//                                 margin="dense"
//                                 label="Profit"
//                                 type="number"
//                                 fullWidth
//                                 value={incomeToEdit.profit}
//                                 onChange={(e) =>
//                                     setIncomeToEdit({
//                                         ...incomeToEdit,
//                                         profit: e.target.value,
//                                     })
//                                 }
//                             />

//                             <TextField
//                                 margin="dense"
//                                 label="Shared Profit"
//                                 type="number"
//                                 fullWidth
//                                 value={incomeToEdit.sharedProfit}
//                                 onChange={(e) =>
//                                     setIncomeToEdit({
//                                         ...incomeToEdit,
//                                         sharedProfit: e.target.value,
//                                     })
//                                 }
//                             />

//                             <TextField
//                                 margin="dense"
//                                 label="Final Amount"
//                                 type="number"
//                                 fullWidth
//                                 value={incomeToEdit.finalAmount}
//                                 onChange={(e) =>
//                                     setIncomeToEdit({
//                                         ...incomeToEdit,
//                                         finalAmount: e.target.value,
//                                     })
//                                 }
//                             />
//                         </>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleCloseEditModal}>Cancel</Button>
//                     <Button onClick={handleUpdateIncome}>Update</Button>
//                 </DialogActions>
//             </Dialog> */}
//         </>
//     );
// };

// export default IncomeModals;