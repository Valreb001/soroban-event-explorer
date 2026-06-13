import clsx from 'clsx'

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={clsx('inline-block animate-spin rounded-full border-2 border-current border-t-transparent', className)} />
  )
}
