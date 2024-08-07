import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

// Styled TableCell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'rgb(20, 20, 20)',
        color: 'rgb(220, 220, 220)',
        fontWeight: 'bold',
    },
    [`&.${tableCellClasses.body}`]: {
        backgroundColor: 'rgb(40, 40, 40)',
        color: 'rgb(200, 200, 200)',
    },
}));

// Styled TableRow
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: 'rgb(27, 27, 27)',
    },
    // Hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    // Add hover effect
    '&:hover': {
        backgroundColor: 'rgba(27, 27, 27, 0.4)',
    },
}));

// Custom TableCell for Name with Conditional Styling
const NameTableCell = styled(StyledTableCell)(({ value }) => ({
    color: value > 0 ? 'rgb(0, 200, 0)' : value < 0 ? 'rgb(200, 0, 0)' : 'inherit',
}));

const TradingViewWidget = (props) => {
    return (
        <TableContainer component={Paper} style={{ backgroundColor: 'rgb(27, 27, 27)' }}>
            <Box sx={{ height: 500, overflow: 'auto' }}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>AssetName</StyledTableCell>
                            <StyledTableCell>Value</StyledTableCell>
                            <StyledTableCell>Bid</StyledTableCell>
                            <StyledTableCell>Ask</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.symbols.map((row, index) => (
                            <StyledTableRow key={row.name}>
                                <NameTableCell 
                                    component="th" 
                                    scope="row"
                                    value={row.value}
                                >
                                    {row.name}
                                </NameTableCell>
                                <StyledTableCell>{row.assetName}</StyledTableCell>
                                <StyledTableCell>{props.bid[index] ? ((props.bid[index] + props.ask[index]) / 2).toFixed(6) : "Closed"}</StyledTableCell>
                                <StyledTableCell>{props.bid[index] ? props.bid[index].toFixed(6) : "Closed"}</StyledTableCell>
                                <StyledTableCell>{props.bid[index] ? props.ask[index].toFixed(6) : "Closed"}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </TableContainer>
    );
}

export default TradingViewWidget;
