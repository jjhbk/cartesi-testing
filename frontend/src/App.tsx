import {
  decodeFunctionData,
  encodeFunctionData,
  getAddress,
  parseAbi,
} from "viem";
import Account from "./components/Account";
import Notices from "./components/Notices";
import Reports from "./components/Reports";
import SendERC20 from "./components/SendERC20";
import SendERC721 from "./components/SendERC721";
import SendEther from "./components/SendEther";
import SimpleInput from "./components/SimpleInput";
import Vouchers from "./components/Vouchers";

function App() {
  const abi = parseAbi(["function withdraw(address token, uint256 amount)"]);
  const input = encodeFunctionData({
    abi: abi,
    functionName: "withdraw",
    args: [getAddress("0x92C6bcA388E99d6B304f1Af3c3Cd749Ff0b591e2"), BigInt(2)],
  });
  const { functionName, args } = decodeFunctionData({ abi, data: input });

  console.log("encoded", input, functionName, args);
  return (
    <>
      <Account />
      <SimpleInput />
      <SendEther />
      <SendERC20 />
      <SendERC721 />
      <Reports />
      <Notices />
      <Vouchers />
    </>
  );
}

export default App;
