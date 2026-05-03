use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("8MEhzdrriUEbKK1s4MmNzK876YmyUAwtF1sWJ9qhdYH");

#[program]
pub mod pluto_program {
    use super::*;

    pub fn send_with_memo(
        ctx: Context<SendWithMemo>,
        amount_lamports: u64,
        recipient_alias: String,
        memo: String,
        timestamp: i64,
    ) -> Result<()> {
        require!(amount_lamports > 0, PlutoError::InvalidAmount);
        require!(recipient_alias.len() <= 50, PlutoError::AliasTooLong);
        require!(memo.len() <= 100, PlutoError::MemoTooLong);

        let clock_timestamp = Clock::get()?.unix_timestamp;
        require!(
            (clock_timestamp - timestamp).abs() <= 300,
            PlutoError::TimestampOutOfRange
        );

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.sender.to_account_info(),
                to: ctx.accounts.recipient.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, amount_lamports)?;

        let record = &mut ctx.accounts.transaction_record;
        record.sender = ctx.accounts.sender.key();
        record.recipient = ctx.accounts.recipient.key();
        record.recipient_alias = recipient_alias;
        record.amount_lamports = amount_lamports;
        record.memo = memo;
        record.timestamp = timestamp;
        record.bump = ctx.bumps.transaction_record;

        emit!(TransactionEvent {
            sender: record.sender,
            recipient: record.recipient,
            amount_lamports: record.amount_lamports,
            recipient_alias: record.recipient_alias.clone(),
            memo: record.memo.clone(),
            timestamp: record.timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(amount_lamports: u64, recipient_alias: String, memo: String, timestamp: i64)]
pub struct SendWithMemo<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(mut)]
    pub recipient: SystemAccount<'info>,

    #[account(
        init,
        payer = sender,
        space = TransactionRecord::space(&recipient_alias, &memo),
        seeds = [
            b"pluto_tx",
            sender.key().as_ref(),
            recipient.key().as_ref(),
            &timestamp.to_le_bytes(),
        ],
        bump
    )]
    pub transaction_record: Account<'info, TransactionRecord>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct TransactionRecord {
    pub sender: Pubkey,
    pub recipient: Pubkey,
    pub recipient_alias: String,
    pub amount_lamports: u64,
    pub memo: String,
    pub timestamp: i64,
    pub bump: u8,
}

impl TransactionRecord {
    pub fn space(alias: &str, memo: &str) -> usize {
        8 + 32 + 32 + 4 + alias.len().min(50) + 8 + 4 + memo.len().min(100) + 8 + 1
    }
}

#[event]
pub struct TransactionEvent {
    pub sender: Pubkey,
    pub recipient: Pubkey,
    pub amount_lamports: u64,
    pub recipient_alias: String,
    pub memo: String,
    pub timestamp: i64,
}

#[error_code]
pub enum PlutoError {
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    #[msg("Recipient alias must be 50 characters or less")]
    AliasTooLong,
    #[msg("Memo must be 100 characters or less")]
    MemoTooLong,
    #[msg("Timestamp must be within five minutes of the current Solana clock")]
    TimestampOutOfRange,
}
