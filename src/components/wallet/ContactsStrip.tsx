import { Plus } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils/cn";
import { shortenAddress } from "@/lib/utils/format";
import type { Contact } from "@/types";

export function ContactsStrip({
  contacts,
  onViewAll,
  onAddContact,
  onSelectContact
}: {
  contacts: Contact[];
  onViewAll: () => void;
  onAddContact: () => void;
  onSelectContact: (contact: Contact) => void;
}) {
  return (
    <section className="space-y-3">
      <SectionHeader
        title="Recent contacts"
        action={
          <button onClick={onViewAll} className="text-sm font-semibold text-pluto-blue">
            View all
          </button>
        }
      />
      <div className="pluto-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {contacts.slice(0, 4).map((contact) => (
          <button
            type="button"
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className="w-[5.4rem] shrink-0 rounded-[1.35rem] border border-pluto-line bg-white p-3 text-center shadow-sm"
          >
            <div className={cn("mx-auto grid h-12 w-12 place-items-center rounded-full text-sm font-bold", contact.color)}>
              {contact.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <p className="mt-2 truncate text-xs font-semibold text-pluto-navy">{contact.name}</p>
            <p className="truncate text-[10px] text-pluto-slate">{shortenAddress(contact.walletAddress, 3, 3)}</p>
          </button>
        ))}
        <button
          type="button"
          onClick={onAddContact}
          className="w-[5.4rem] shrink-0 rounded-[1.35rem] border border-dashed border-pluto-line bg-white/70 p-3 text-center text-pluto-slate"
        >
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-pluto-ice text-pluto-blue">
            <Plus className="h-5 w-5" />
          </div>
          <p className="mt-2 text-xs font-semibold">Add new</p>
        </button>
      </div>
    </section>
  );
}
