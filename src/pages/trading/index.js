import React, { useEffect, useState } from 'react';
import TradingViewChart from '../../components/TradingViewChart';
import WatchList from '../../components/WatchList';
import "./index.css";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AccountManagement from './account/AccountManagement';
import { useSelector } from 'react-redux';
import Logout from '../../components/Auth/Logout';
import { fetchSymbols } from '../../utils/api';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#101013',
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: '10px',
}));

const Trading = () => {
  const [isAuth, setIsAuth] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState("FX:EURUSD");
  const [symbols, setSymbols] = useState([]);
  const [bid, setBid] = useState([0, 0, 0, 0, 0, 0]);
  const [ask, setAsk] = useState([0, 0, 0, 0, 0, 0]);
  const [accounts, setAccounts] = useState([]);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    async function fetchData() {
      setSymbols(await fetchSymbols());
    }
    fetchData();
  }, []);

  const handleAccountChange = (e) => {
    const selectedAccount = accounts.find(account => account.token === e.target.value);
    if (selectedAccount) {
      localStorage.setItem("tradeToken", selectedAccount.token);
    }
  };

  return (
    <>
      <div style={{ height: "50px" }}>
        <div style={{ float: 'right', width: '40%' }}>
          <Logout />
          <select onChange={handleAccountChange} className='account-switch'>
            {accounts.map((account, index) => (
              <option key={index} value={account.token}>
                {account.type}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='trading-page-container'>
        <div style={{ width: '40px' }}></div>
        <div className='tradingview-container'>
          <div className='chart-container'>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Item sx={{ height: isAuth ? "500px" : "700px" }} p={5}>
                  <TradingViewChart
                    selectedSymbol={selectedSymbol}
                    setSelectedSymbol={setSelectedSymbol}
                  />
                </Item>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', flexDirection: "column", flex: '' }}>
                <Item sx={{ height: '80%' }} p={5}>
                  <WatchList
                    height={isAuth ? "500" : "700"}
                    symbols={symbols}
                    bid={bid}
                    ask={ask}
                    setSelectedSymbol={setSelectedSymbol}
                  />
                </Item>
              </Grid>
            </Grid>
          </div>
          <Box p={1}></Box>
          {isAuth && (
            <Box
              sx={{ borderRadius: '10px', marginBottom: '0px', flex: "33.01 1 0px" }}
              key="account-management"
            >
              <AccountManagement
                setIsAuth={setIsAuth}
                selectedSymbol={selectedSymbol}
                setSelectedSymbol={setSelectedSymbol}
                symbols={symbols}
                bid={bid}
                setBid={setBid}
                ask={ask}
                setAsk={setAsk}
                setAccounts={setAccounts}
              />
            </Box>
          )}
        </div>
      </div>
    </>
  );
};

export default Trading;
