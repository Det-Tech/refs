import { RECOVERY_STATES } from "@/lib/auth/account"
import { ArrowUpTrayIcon, ArrowRightIcon } from "@heroicons/react/24/outline"

type Props = {
  handleFileInput: (files: FileList) => Promise<void>
  state: RECOVERY_STATES
}

const RecoveryKitButton = ({ handleFileInput, state }: Props) => {
  const buttonData = {
    [RECOVERY_STATES.Processing]: {
      text: "Processing recovery kit...",
      props: {
        disabled: state === RECOVERY_STATES.Processing,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        on_click: () => {},
      },
    },
    [RECOVERY_STATES.Done]: {
      text: "Continue to the app",
      props: {
        on_click: () => window.location.href = "/",
      },
    },
  }

  if (state === RECOVERY_STATES.Ready || state === RECOVERY_STATES.Error) {
    return (
      <>
        <label
          htmlFor="upload-recovery-kit"
          className="flex justify-center items-center gap-2 bg-orange-400 hover:bg-orange-500 cursor-pointer px-6 py-3 rounded-lg w-full select-none"
        >
          <ArrowUpTrayIcon className="w-5" /> Upload your recovery kit
        </label>
        <input
          onChange={(e) => handleFileInput(e.target.files)}
          id="upload-recovery-kit"
          type="file"
          accept=".txt"
          className="hidden"
        />
      </>
    )
  }

  const { on_click, ...props } = buttonData[state].props

  return (
    <button
      className="flex justify-center items-center select-none gap-2 bg-sky-400 hover:bg-sky-500 cursor-pointer px-6 py-3 rounded-lg w-full"
      {...props}
      onClick={on_click}
    >
      {state === RECOVERY_STATES.Processing && (
        <span className="animate-spin ease-linear rounded-full border-2 border-t-2 border-t-orange-500 border-neutral-900 w-[16px] h-[16px] text-sm select-none" />
      )}
      {buttonData[state].text}
      {state === RECOVERY_STATES.Done && <ArrowRightIcon className="w-5" />}
    </button>
  )
}

export default RecoveryKitButton
