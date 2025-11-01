import LoadingButtonWrapper from './Button/Web3Button';

interface TokenInputProps {
  value: number;
  onChange?: (value: number) => void;
  onMaxClick?: () => void;
  actionLabel?: string;
  onAction?: () => Promise<void>; // Updated to return a Promise
  disabled: boolean;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  value,
  onChange,
  onMaxClick,
  actionLabel,
  onAction,
  disabled,
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 2,
    }}>
      <div style={{
        flex: 3,
        border: '1px solid rgba(30, 41, 59, 0.3)',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.2)'
      }}>
        <input
          type="number"
          value={value}
          onChange={onChange ? (e) => onChange(parseFloat(e.target.value) || 0) : undefined}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            width: '100%',
            outline: 'none',
            fontSize: '16px',
            padding: '12px 16px',
            appearance: onChange ? 'auto' : 'textfield' // Hide arrows if no onChange
          }}
          placeholder="0"
        />
        {onMaxClick &&
          <button
            style={{
              color: 'white',
              minWidth: 'auto',
              padding: '8px 12px',
            }}
            onClick={onMaxClick}
          >
            Max
          </button>
        }
      <LoadingButtonWrapper actionLabel={actionLabel} onClick={onAction} disabled={disabled}>
        {actionLabel}
      </LoadingButtonWrapper>
      </div>
    </div>
  );
};
