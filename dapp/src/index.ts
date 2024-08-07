import { createApp } from "@deroll/app";
import { createRouter } from "@deroll/router";
import { createERC20TransferVoucher, createWallet } from "@deroll/wallet";
import { decodeFunctionData, parseAbi } from "viem";

// create app
const app = createApp({ url: "http://127.0.0.1:5004" });

// create wallet
const wallet = createWallet();

const router = createRouter({ app });

router.add<{ address: string }>("wallet/:address", ({ params: { address } }) =>
  JSON.stringify(wallet.getWallet(address), (_, v) =>
    typeof v === "bigint" ? v.toString() : v
  )
);

app.addInspectHandler(router.handler);

app.addAdvanceHandler(wallet.handler);
// define application ABI
const abi = parseAbi(["function withdraw(address token, uint256 amount)"]);

// handle input encoded as ABI function call
app.addAdvanceHandler(async ({ metadata, payload }) => {
  const { functionName, args } = decodeFunctionData({ abi, data: payload });

  switch (functionName) {
    case "withdraw":
      const [token, amount] = args;
      const recipient = metadata.msg_sender;

      // encode voucher of token transfer to requester
      const voucher = createERC20TransferVoucher(token, recipient, amount);

      // create voucher output
      await app.createVoucher(voucher);
      return "accept";
  }
});
// log incoming advance request
app.addAdvanceHandler(async ({ payload }) => {
  await app.createNotice({ payload }); //just for logging purposes
  await app.createReport({ payload }); //just for logging purposes
  return "accept";
});

// start app
app.start().catch((e) => {
  console.log(e);
  process.exit(1);
});
