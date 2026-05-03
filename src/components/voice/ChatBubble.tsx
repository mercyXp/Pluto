import { PlutoLogo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils/cn";
import type { ChatMessage, Contact } from "@/types";

export function ChatBubble({
  message,
  onChooseContact
}: {
  message: ChatMessage;
  onChooseContact?: (contact: Contact) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full items-end gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser ? (
        <div className="mb-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white shadow-sm ring-1 ring-pluto-line">
          <PlutoLogo showWordmark={false} size="sm" className="scale-75" />
        </div>
      ) : null}
      <div
        className={cn(
          "max-w-[82%] rounded-[1.35rem] px-4 py-3 text-sm leading-5 shadow-sm",
          isUser
            ? "rounded-br-md bg-pluto-blue text-white"
            : "rounded-bl-md border border-pluto-line bg-white text-pluto-navy",
          message.variant === "error" ? "border-red-100 bg-red-50 text-red-700" : ""
        )}
      >
        <p>{message.text}</p>
        {message.choices?.length ? (
          <div className="mt-3 grid gap-2">
            {message.choices.map((contact) => (
              <button
                key={contact.id}
                onClick={() => onChooseContact?.(contact)}
                className="flex items-center justify-between rounded-2xl border border-pluto-line bg-pluto-mist px-3 py-2 text-left transition hover:border-pluto-blue/50"
              >
                <span className="font-semibold">{contact.name}</span>
                <span className="text-xs text-pluto-slate">ending {contact.walletEnding}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
