import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import StatusBar from './StatusBar';
import PositionsTable from './PositionsTable';
import RealPositionsTable from './RealPositionsTable';
import axiosInstance from "../../../utils/axios";
import { Modal } from '@mui/material';
import global from '../../../utils/global';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

const AntTabs = styled(Tabs)({
    borderBottom: '1px solid #1b1b1f',
    '& .MuiTabs-indicator': {
        backgroundColor: 'white',
        height: '1px'
    },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
    textTransform: 'none',
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
        minWidth: 0,
    },
    fontWeight: theme.typography.fontWeightMedium,
    marginRight: theme.spacing(1),
    fontSize: '12px',
    color: '#89898b',
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
        color: 'white',
        opacity: 1,
    },
    '&.Mui-selected': {
        color: 'white',
        fontWeight: theme.typography.fontWeightMedium,
    },
    '&.Mui-focusVisible': {
        backgroundColor: '#101013',
    },
}));

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF']

export default function AccountManagement(props) {
    const [value, setValue] = React.useState(0);
    const [leverage, setLeverage] = React.useState(1);
    // const [commition, setCommition] = React.useState(1);
    const commition = 0.03;
    const pip_size = 0.0001;

    const [updateProfit, setUpdateProfit] = React.useState(0);
    const [updateLoss, setUpdateLoss] = React.useState(0);

    const [bid, setBid] = React.useState([0, 0, 0, 0, 0, 0]);
    const [ask, setAsk] = React.useState([0, 0, 0, 0, 0, 0]);
    const [symbol, setSymbol] = React.useState("EURUSD");
    const [amount, setAmount] = React.useState(0);

    const [openPositionsData, setOpenPositionsData] = React.useState([]);
    const [realPositionsData, setRealPositionsData] = React.useState([]);

    const [balance, setBalance] = React.useState(10000);
    const [profit, setProfit] = React.useState(0);
    const [marginUsed, setMarginUsed] = React.useState(0);
    const [marginAvailable, setMarginAvailable] = React.useState(0);
    const [equity, setEquity] = React.useState(10000);

    const [updateModalVisible, setUpdateModalVisible] = React.useState(false);
    const [updateID, setUpdateID] = React.useState(0);

    const positionInterval = React.useRef(null);

    React.useEffect(() => {
        const ws = new WebSocket('wss://marketdata.tradermade.com/feedadv');

        const updateBid = (index, newValue) => {
            setBid(prevBids => {
                const newBids = [...prevBids];
                newBids[index] = newValue;
                return newBids;
            });
        };

        const updateAsk = (index, newValue) => {
            setAsk(prevAsks => {
                const newAsks = [...prevAsks];
                newAsks[index] = newValue;
                return newAsks;
            });
        };

        const handleOpen = () => {
            console.log('WebSocket connection established');
            ws.send(`{"userKey":"sio4HcKFafyguv1rn8NLA", "symbol":"EURUSD,GBPUSD,USDJPY,AUDUSD,USDCAD,USDCHF"}`);
        };

        const handleMessage = (event) => {
            try {
                if (event.data !== "Connected") {
                    const data = JSON.parse(event.data);
                    updateAsk(Symbols.indexOf(data.symbol), data.ask);
                    updateBid(Symbols.indexOf(data.symbol), data.bid);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        const handleClose = () => {
            console.log('WebSocket connection closed');
        };

        const handleError = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.addEventListener('open', handleOpen);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', handleClose);
        ws.addEventListener('error', handleError);

        positionInterval.current = setInterval(getAllPositions, 3000);


        return () => {
            ws.removeEventListener('open', handleOpen);
            ws.removeEventListener('message', handleMessage);
            ws.removeEventListener('close', handleClose);
            ws.removeEventListener('error', handleError);
            ws.close();
        };
    }, []);

    const getAllPositions = () => {
        axiosInstance.post("/getAllPositions")
            .then((res) => {
                if (res.data.state) {
                    props.setIsAuth(false);
                    localStorage.removeItem("tradeToken");
                    window.location.reload();
                    return;
                }
                // console.log("data : ", res.data);
                const { positions, realPositions, leverage, margin, balance } = res.data;
                setOpenPositionsData(positions);
                setRealPositionsData(realPositions);
                setLeverage(leverage);
                setBalance(balance);
                setMarginUsed(margin);
                setMarginAvailable(balance - margin);
            })
            .catch((err) => {
                console.log("Axios Error with ", err);
            })
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleOption = (option) => {
        const data = {
            amount: amount,
            symbol: symbol,
            option: option,
        }
        axiosInstance.post("/createPosition", data)
            .then((res) => {
                if (res.data.state) {
                    props.setIsAuth(false);
                    localStorage.removeItem("tradeToken");
                    return;
                }
                // console.log("data : ", res.data);
                const { positions, leverage, balance, margin } = res.data;
                setOpenPositionsData(positions);
                setLeverage(leverage);
                setBalance(balance);
                setMarginUsed(margin);
                setMarginAvailable(balance - margin);
            })
            .catch((err) => {
                console.log("Axios Error with ", err);
            })
    };

    const handleCancel = (id) => {
        axiosInstance.post("/cancelPosition", { id })
            .then((res) => {
                // console.log("data : ", res.data);
                const { positions, realPositions, leverage, margin, balance } = res.data;
                setOpenPositionsData(positions);
                setRealPositionsData(realPositions);
                setLeverage(leverage);
                setBalance(balance);
                setMarginUsed(margin);
                setMarginAvailable(balance - margin);
            })
            .catch((err) => {
                console.log("Axios Error with ", err);
            })
    }

    const handleUpdate = (id) => {
        setUpdateModalVisible(true);
        setUpdateID(id);
    }

    const handleModalClose = () => {
        setUpdateModalVisible(false);
    }

    const handleUpdateSave = () => {
        axiosInstance.post("/updatePosition", { updateID, updateProfit, updateLoss })
            .then((res) => {
                // console.log("data : ", res.data);
                const { positions, leverage } = res.data;
                setOpenPositionsData(positions);
                setLeverage(leverage);
            })
            .catch((err) => {
                console.log("Axios Error with ", err);
            })
        setUpdateModalVisible(false);
    }

    return (
        <>
            <Box my={0} sx={{ width: '100%', marginBottom: '0px', bgcolor: '#101013', height: '100%', borderRadius: '10px' }}>
                <div style={{ display: 'flex' }}>
                    <AntTabs value={value} onChange={handleChange} aria-label="ant example">
                        <AntTab label="Positions" />
                        <AntTab label="Real Positions" />
                    </AntTabs>
                    <StatusBar
                        balance={balance}
                        equity={equity}
                        profit={profit}
                        marginUsed={marginUsed}
                        marginAvailable={marginAvailable}
                    />
                </div>
                <div className='trading-setting'>
                    <span className='font-white'>Symbol : </span>
                    <select id="Symbol" name="Symbol" defaultValue={"EURUSD"} className='trading-symbol' onChange={(e) => setSymbol(e.target.value)}>
                        <option value="EURUSD">EUR to USD</option>
                        <option value="USDJPY">USD to JPY</option>
                        <option value="GBPUSD">GBP to USD</option>
                        <option value="AUDUSD">AUD to USD</option>
                        <option value="USDCAD">USD to CAD</option>
                        <option value="USDCHF">USD to CHF</option>
                    </select>
                    <input value={`Bid: ${bid[Symbols.indexOf(symbol)]}`} className='trading-leverage' readOnly />
                    <button onClick={() => { handleOption(true) }} className='trading-btns'>Sell</button>
                    <input defaultValue={amount} className='trading-amount' onChange={(e) => setAmount(e.target.value)} />
                    <button onClick={() => { handleOption(false) }} className='trading-btns'>Buy</button>
                    <input value={`Ask: ${ask[Symbols.indexOf(symbol)]}`} className='trading-leverage' readOnly />
                </div>
                <CustomTabPanel value={value} index={0}>
                    <PositionsTable
                        positionData={openPositionsData}
                        leverage={leverage}
                        commition={commition}
                        pip_size={pip_size}
                        bids={bid}
                        asks={ask}
                        setEquity={setEquity}
                        handleCancel={handleCancel}
                        handleUpdate={handleUpdate}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <RealPositionsTable
                        positionData={realPositionsData}
                    />
                </CustomTabPanel>
            </Box>
            <Modal
                open={updateModalVisible}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ width: '20%', margin: '10% auto', bgcolor: '#dddddd', height: '200px', borderRadius: '10px', padding: '10px 0 0 0' }}>

                    <TextField label="Take Profit" variant="standard" onChange={(e) => setUpdateProfit(e.target.value)} style={{ margin: 'auto', display: "block", width: "60%" }} />
                    <TextField label="Stop Loss" variant="standard" onChange={(e) => setUpdateLoss(e.target.value)} style={{ margin: 'auto', display: "block", width: "60%" }} />
                    <div style={{ margin: '15px auto', width: '60%' }}>
                        <Button variant="outlined" onClick={handleUpdateSave} style={{ margin: '5px 10px' }}>Save</Button>
                        <Button variant="outlined" onClick={handleModalClose} style={{ margin: '5px 10px' }}>Close</Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
}
