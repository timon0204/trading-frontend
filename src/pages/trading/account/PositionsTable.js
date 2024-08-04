import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material';
import Paper from '@mui/material/Paper';
import WatchListItem from '../../../components/WatchListItem';

function createData(name, calories, size, carbs, protein) {
  return { name, calories, size, carbs, protein };
}

const Symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF']

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&.MuiTableRow-root': {
    cursor: "pointer"
  },
  '&:hover': {
    backgroundColor: 'black',
    opacity: 1,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    border: 0,
    color: "#89898b",
    fontSize: '10.5px'
  },
  [`&.${tableCellClasses.body}`]: {
    border: 0,
    color: "#89898b",
    fontSize: 10.5,
  },
}));

const TableBuyCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: 0,
    color: "#54c88c",
    fontSize: 10.5,
  }
}));

const TableSellCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: 0,
    color: "#ff6f6f",
    fontSize: 10.5,
  }
}));



const PositionsTable = (props) => {
  let totalProfit = 0;
  React.useEffect(() => {
    for(const row of props.positionData) {
      totalProfit += ((row.type == "Sell" ? row.startPrice - props.bids[Symbols.indexOf(row.symbol)] : props.asks[Symbols.indexOf(row.symbol)] - row.startPrice) / props.pip_size * row.size - props.commition);
      console.log("totalProfit : ", totalProfit);
    };
    props.setEquity(totalProfit);
  })
  return (
    <TableContainer sx={{ fontWeight: 600 }}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Instrument</StyledTableCell>
            <StyledTableCell>Position ID</StyledTableCell>
            <StyledTableCell>Time</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Size</StyledTableCell>
            <StyledTableCell>Start Price</StyledTableCell>
            <StyledTableCell>Stop Loss</StyledTableCell>
            <StyledTableCell>Take Profit</StyledTableCell>
            <StyledTableCell>Current Price</StyledTableCell>
            <StyledTableCell>Commission</StyledTableCell>
            <StyledTableCell>Profit</StyledTableCell>
            <StyledTableCell>Final Profit</StyledTableCell>
            <StyledTableCell>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.positionData.map((row) => (
            <StyledTableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                <WatchListItem fromCurrency={row.symbol.slice(0, 3)} toCurrency={row.symbol.slice(3, 6)} />
              </StyledTableCell>
              <StyledTableCell>{row.id}</StyledTableCell>
              <StyledTableCell>{row.createdAt}</StyledTableCell>
              <TableBuyCell>{row.type}</TableBuyCell>
              <StyledTableCell>{row.size}</StyledTableCell>
              <StyledTableCell>{row.startPrice}</StyledTableCell>
              <StyledTableCell>{row.stopLoss}</StyledTableCell>
              <StyledTableCell>{row.takeProfit}</StyledTableCell>
              <StyledTableCell>{row.type == "Sell" ? props.bids[Symbols.indexOf(row.symbol)] : props.asks[Symbols.indexOf(row.symbol)]}</StyledTableCell>
              <StyledTableCell>{props.commition}</StyledTableCell>
              <StyledTableCell>{((row.type == "Sell" ? row.startPrice - props.bids[Symbols.indexOf(row.symbol)] : props.asks[Symbols.indexOf(row.symbol)] - row.startPrice) / props.pip_size * row.size).toFixed(2)}</StyledTableCell>
              <StyledTableCell>{((row.type == "Sell" ? row.startPrice - props.bids[Symbols.indexOf(row.symbol)] : props.asks[Symbols.indexOf(row.symbol)] - row.startPrice) / props.pip_size * row.size - props.commition).toFixed(2)}</StyledTableCell>
              <StyledTableCell><button onClick={() => { props.handleCancel(row.id) }} className='trading-btns'>Close</button><button onClick={() => { props.handleUpdate(row.id) }} className='trading-btns'>Update</button></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PositionsTable;