import React, { useEffect, useState } from 'react';
import TradingViewChart from '../../components/TradingViewChart';
import WatchList from '../../components/WatchList';
import "./index.css";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
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
    const [symbols, setSymbols] = React.useState([]);
    const user = useSelector((state) => state.auth.user)
    console.log("this is a user", user)
    useEffect(() => {
        async function fetchData() {
            setSymbols(await fetchSymbols());
        }
        fetchData();
    }, [])
    return (
        <>
            <div style={{ height: "50px" }}>
                <div style={{ float: 'right', width: '40%' }}>
                    <Logout />
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
                                    />
                                </Item>
                            </Grid>
                        </Grid>
                    </div>
                    <Box p={1}></Box>
                    {isAuth ?
                        <Box
                            sx={{ borderRadius: '10px', marginBottom: '0px', flex: "33.01 1 0px" }}
                        >
                            <AccountManagement
                                setIsAuth={setIsAuth}
                                selectedSymbol={selectedSymbol}
                                setSelectedSymbol={setSelectedSymbol}
                                symbols={symbols}
                            />
                        </Box>
                        : <></>
                    }

                </div>
            </div>
        </>
    )
}

export default Trading;