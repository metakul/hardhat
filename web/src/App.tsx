import { useState, useEffect } from "react";
import {
  useActiveAccount,
  useSendTransaction,
  useReadContract,
  TransactionButton,
} from "thirdweb/react";
import { client, config, erc20contract, stakingContract } from "./config";
import { prepareContractCall } from "thirdweb";
import { TokenInput } from "./components/TokenInput";
import { ConnectButton } from "thirdweb/react";

export default function App() {
  const account = useActiveAccount();
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0); // 🆕 new
  const [isApproving, setIsApproving] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false); // 🆕 new
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { mutateAsync: sendTransaction } = useSendTransaction();

  // Read balances
  const { data: erc20Balance, refetch: refetchBalance } = useReadContract({
    contract: erc20contract,
    method: "function balanceOf(address owner) view returns (uint256)",
    params: [account?.address || "0x"],
  });

  const { data: stakedAmount } = useReadContract({
    contract: stakingContract,
    method: "function stakes(address owner) view returns (uint256)",
    params: [account?.address || "0x"],
  });

  const { data: erc20ApprovedToken, refetch: refetchAllowance } =
    useReadContract({
      contract: erc20contract,
      method:
        "function allowance(address owner, address spender) view returns (uint256)",
      params: [account?.address || "0x", config.stakeContractAddress],
    });

  // ✅ Approve
  const handleApprove = async (amountInWei: bigint): Promise<void> => {
    try {
      setIsApproving(true);
      setError(null);
      setSuccess(null);

      const approveTx = prepareContractCall({
        contract: erc20contract,
        method: "function approve(address spender, uint256 amount)",
        params: [stakingContract.address, amountInWei],
      });

      await sendTransaction(approveTx);
      setSuccess("✅ Approval successful!");

      await new Promise((resolve) => setTimeout(resolve, 5000));
      await refetchAllowance();
    } catch (error: any) {
      setError("Approval failed: " + (error?.message || "Please try again."));
    } finally {
      setIsApproving(false);
    }
  };

  // ✅ Stake
  const handleStake = async (): Promise<void> => {
    setError(null);
    setSuccess(null);

    if (!account) {
      setError("Please connect your wallet.");
      return;
    }
    if (stakeAmount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    const amountInWei = BigInt(Math.floor(stakeAmount * 1e18));

    if (erc20Balance === undefined || amountInWei > erc20Balance) {
      setError("Insufficient token balance.");
      return;
    }

    const approved = erc20ApprovedToken && amountInWei <= erc20ApprovedToken;
    if (!approved) {
      await handleApprove(amountInWei);
      return;
    }

    try {
      setIsStaking(true);
      const stakeTx = prepareContractCall({
        contract: stakingContract,
        method: "function deposit(uint256 amount, address referrer)",
        params: [amountInWei, "0x0000000000000000000000000000000000000000"],
      });

      await sendTransaction(stakeTx);
      setSuccess("✅ Staking successful!");
    } catch (error: any) {
      setError("Staking failed: " + (error?.data?.message || error?.message));
    } finally {
      setIsStaking(false);
      refetchBalance();
    }
  };

  // ✅ Withdraw
  const handleWithdraw = async (): Promise<void> => {
    setError(null);
    setSuccess(null);

    if (!account) {
      setError("Please connect your wallet.");
      return;
    }

    if (withdrawAmount <= 0) {
      setError("Withdraw amount must be greater than 0.");
      return;
    }

    const amountInWei = BigInt(Math.floor(withdrawAmount * 1e18));

    if (stakedAmount === undefined || amountInWei > stakedAmount) {
      setError("Insufficient staked balance.");
      return;
    }

    try {
      setIsWithdrawing(true);
      const withdrawTx = prepareContractCall({
        contract: stakingContract,
        method: "function withdraw(uint256 amount)",
        params: [amountInWei],
      });

      await sendTransaction(withdrawTx);
      setSuccess("🎉 Withdraw successful!");
    } catch (error: any) {
      setError("Withdraw failed: " + (error?.data?.message || error?.message));
    } finally {
      setIsWithdrawing(false);
      refetchBalance();
    }
  };

  // Auto stake after approval
  useEffect(() => {
    if (
      isApproving === false &&
      stakeAmount > 0 &&
      erc20ApprovedToken &&
      BigInt(Math.floor(stakeAmount * 1e18)) <= erc20ApprovedToken
    ) {
      handleStake();
    }
  }, [erc20ApprovedToken]);

  // Auto hide messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-950 text-white">
      <h1 className="text-3xl font-bold">ERC20 Staking DApp</h1>

      <div className="text-md text-gray-400">
        Token Balance: {(Number(erc20Balance || 0n) / 1e18).toFixed(4)} Tokens
      </div>
      <div className="text-md text-gray-400">
        Approved: {(Number(erc20ApprovedToken || 0n) / 1e18).toFixed(4)} Tokens
      </div>
      <div className="text-md text-gray-400">
        Staked Balance: {(Number(stakedAmount || 0n) / 1e18).toFixed(4)} Tokens
      </div>

      {/* Stake Token Input */}
      <TokenInput
        value={stakeAmount}
        onChange={setStakeAmount}
        onMaxClick={() => setStakeAmount(Number(erc20Balance || 0n) / 1e18)}
        actionLabel={
          isApproving ? "Approving..." : isStaking ? "Staking..." : "Stake"
        }
        onAction={handleStake}
        disabled={!account || stakeAmount <= 0 || isApproving || isStaking}
      />

      {/* Withdraw Token Input */}
      <TokenInput
        value={withdrawAmount}
        onChange={setWithdrawAmount}
        onMaxClick={() => setWithdrawAmount(Number(stakedAmount || 0n) / 1e18)}
        actionLabel={isWithdrawing ? "Withdrawing..." : "Withdraw"}
        onAction={handleWithdraw}
        disabled={!account || withdrawAmount <= 0 || isWithdrawing}
      />

      {/* Connect + Claim */}
      <div className="flex flex-row gap-4 items-center">
        <ConnectButton client={client} />
        <TransactionButton
          transaction={() => {
            setError(null);
            setSuccess(null);
            const tx = prepareContractCall({
              contract: stakingContract,
              method: "function claim()",
              params: [],
            });
            return tx;
          }}
          onTransactionConfirmed={() => {
            setSuccess("🎉 Claim successful!");
          }}
          onError={(error) => {
            const message =
              error?.cause instanceof Error
                ? error.cause.message
                : error?.message || "Unknown transaction error.";
            setError(`Transaction error: ${message}`);
          }}
        >
          Claim Tokens
        </TransactionButton>
      </div>

      {/* Error / Success */}
      {error && (
        <div className="fixed bottom-4 w-[90%] max-w-md text-center bg-red-500 text-white p-3 rounded-xl shadow-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed bottom-4 w-[90%] max-w-md text-center bg-green-500 text-white p-3 rounded-xl shadow-lg">
          {success}
        </div>
      )}
    </div>
  );
}
