"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HomeLayer } from "@/components/wallet/HomeLayer";
import { VoiceLayer } from "@/components/voice/VoiceLayer";
import { ConfirmationScreen } from "@/components/transactions/ConfirmationScreen";
import { SuccessScreen } from "@/components/transactions/SuccessScreen";
import { Button } from "@/components/ui/Button";
import { demoActivities } from "@/data/mock/activities";
import { starterMessages } from "@/data/mock/chat";
import { demoContacts } from "@/data/mock/contacts";
import { demoSettings } from "@/data/mock/settings";
import { demoWallet } from "@/data/mock/wallet";
import { auth } from "@/lib/firebase/client";
import {
  createOrSignInWithEmail,
  firebaseDataAvailable,
  initializePlutoUser,
  loadPlutoData,
  removeContact as removeFirebaseContact,
  saveActivity as saveFirebaseActivity,
  saveContact as saveFirebaseContact,
  savePaymentRequest as saveFirebasePaymentRequest,
  saveSettings as saveFirebaseSettings,
  saveWallet as saveFirebaseWallet,
  signInDemoUser,
  type PlutoFirebaseState
} from "@/lib/firebase/plutoData";
import { handleConversationMessage } from "@/lib/intent/conversationManager";
import { AuthScreen, CreateWalletScreen, ImportWalletScreen, PinScreen } from "@/screens/AuthScreens";
import { ActivityDetailScreen } from "@/screens/ActivityDetailScreen";
import { AddFundsScreen } from "@/screens/AddFundsScreen";
import { ContactDetailScreen } from "@/screens/ContactDetailScreen";
import { ContactEditorScreen, type ContactEditorDraft } from "@/screens/ContactEditorScreen";
import { ContactsScreen } from "@/screens/ContactsScreen";
import { Onboarding } from "@/screens/Onboarding";
import { ReceiveScreen } from "@/screens/ReceiveScreen";
import { RequestPaymentScreen } from "@/screens/RequestPaymentScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { SplashScreen } from "@/screens/SplashScreen";
import type {
  Activity,
  ChatMessage,
  Contact,
  ConversationContext,
  IntentParseResult,
  OrbState,
  PaymentRequest,
  PendingTransaction,
  PlutoSettings,
  Screen
} from "@/types";
import { onAuthStateChanged } from "firebase/auth";

function messageId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseContactDraftCommand(text: string): ContactEditorDraft | undefined {
  const trimmed = text.trim();
  const isContactCommand =
    /^(add|save|create)\s+(a\s+)?contact\b/i.test(trimmed) ||
    /^add\s+.+\s+to\s+(my\s+)?contacts\b/i.test(trimmed);

  if (!isContactCommand) return undefined;

  const withoutLead = trimmed
    .replace(/^(add|save|create)\s+(a\s+)?contact(\s+named)?\s*/i, "")
    .replace(/^add\s+/i, "")
    .replace(/\s+to\s+(my\s+)?contacts.*$/i, "")
    .trim();

  const walletMatch = withoutLead.match(
    /^(.*?)(?:\s+(?:with|using|wallet|address|at)\s+(?:wallet\s+|address\s+)?)([1-9A-HJ-NP-Za-km-z]{6,})$/i
  );

  const name = (walletMatch?.[1] || withoutLead).replace(/\s+$/g, "").trim();
  const walletAddress = walletMatch?.[2]?.trim();

  return {
    name: name || undefined,
    walletAddress,
    aliases: name ? [name] : undefined,
    trusted: true,
    notes: "Added from a Pluto voice/text command."
  };
}

export function PlutoApp() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [activities, setActivities] = useState<Activity[]>(demoActivities);
  const [contacts, setContacts] = useState<Contact[]>(demoContacts);
  const [wallet, setWallet] = useState(demoWallet);
  const [settings, setSettings] = useState<PlutoSettings>(demoSettings);
  const [firebaseUid, setFirebaseUid] = useState<string | undefined>();
  const [backendLabel, setBackendLabel] = useState(firebaseDataAvailable ? "Firebase ready" : "Local fallback");
  const [homeRevealed, setHomeRevealed] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [conversationState, setConversationState] =
    useState<NonNullable<ConversationContext["state"]>>("idle");
  const [pendingIntent, setPendingIntent] = useState<IntentParseResult | undefined>();
  const [pendingTransaction, setPendingTransaction] = useState<PendingTransaction | undefined>();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | undefined>();
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>();
  const [contactEditorMode, setContactEditorMode] = useState<"add" | "edit">("add");
  const [contactDraft, setContactDraft] = useState<ContactEditorDraft | undefined>();
  const [signature, setSignature] = useState("");
  const [isSending, setIsSending] = useState(false);

  const applyFirebaseState = useCallback((state: PlutoFirebaseState) => {
    setFirebaseUid(state.profile.uid);
    setWallet(state.wallet);
    setContacts(state.contacts);
    setActivities(state.activities);
    setSettings(state.settings);
    setBackendLabel(state.profile.demoMode ? "Firebase demo sync" : "Firebase sync");
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const hasEntered = window.localStorage.getItem("pluto-demo-entered") === "true";
      setScreen(hasEntered ? "app" : "onboarding");
    }, 1700);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!auth) return undefined;

    return onAuthStateChanged(auth, (user) => {
      if (!user || window.localStorage.getItem("pluto-demo-entered") !== "true") return;

      void loadPlutoData(user.uid)
        .then(applyFirebaseState)
        .catch(() => {
          setFirebaseUid(undefined);
          setBackendLabel("Local fallback");
        });
    });
  }, [applyFirebaseState]);

  const addMessage = useCallback((message: Omit<ChatMessage, "id" | "createdAt">) => {
    setMessages((current) => [
      ...current,
      {
        id: messageId(message.role),
        createdAt: new Date().toISOString(),
        ...message
      }
    ]);
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!settings.voiceEnabled) return;
    try {
      const response = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (!response.ok) return;
      const data = (await response.json()) as { audioBase64?: string; contentType?: string };
      if (!data.audioBase64 || typeof Audio === "undefined") return;
      const audio = new Audio(`data:${data.contentType || "audio/mpeg"};base64,${data.audioBase64}`);
      await audio.play().catch(() => undefined);
    } catch {
      // Voice playback is intentionally non-blocking so the hackathon demo stays usable offline.
    }
  }, [settings.voiceEnabled]);

  const enterDemo = useCallback(async () => {
    window.localStorage.setItem("pluto-demo-entered", "true");
    setMessages(starterMessages);
    setActivities(demoActivities);
    setContacts(demoContacts);
    setWallet(demoWallet);
    setSettings(demoSettings);
    setPendingIntent(undefined);
    setPendingTransaction(undefined);
    setPaymentRequest(undefined);
    setSelectedContact(undefined);
    setSelectedActivity(undefined);
    setContactDraft(undefined);
    setContactEditorMode("add");
    setConversationState("idle");
    setHomeRevealed(false);
    setOrbState("idle");
    setScreen("app");

    if (!firebaseDataAvailable) {
      setBackendLabel("Local demo fallback");
      return;
    }

    try {
      const user = await signInDemoUser();
      const state = await initializePlutoUser(user, { demoMode: true });
      applyFirebaseState(state);
    } catch {
      setFirebaseUid(undefined);
      setBackendLabel("Local demo fallback");
    }
  }, [applyFirebaseState]);

  const handleAuthContinue = useCallback(
    async (email: string, password: string) => {
      if (!firebaseDataAvailable) {
        throw new Error("Firebase is not configured in this environment.");
      }

      const user = await createOrSignInWithEmail(email, password);
      const state = await initializePlutoUser(user, { demoMode: false });
      applyFirebaseState(state);
      setScreen("create-wallet");
    },
    [applyFirebaseState]
  );

  const continueWalletSetup = useCallback(async () => {
    if (firebaseUid) {
      await saveFirebaseWallet(firebaseUid, wallet).catch(() => setBackendLabel("Firebase write issue"));
    }
    setScreen("pin");
  }, [firebaseUid, wallet]);

  const enterAppAfterSetup = useCallback(async () => {
    window.localStorage.setItem("pluto-demo-entered", "true");
    if (firebaseUid) {
      await Promise.all([
        saveFirebaseSettings(firebaseUid, settings),
        saveFirebaseWallet(firebaseUid, wallet)
      ]).catch(() => setBackendLabel("Firebase write issue"));
    }
    setScreen("app");
  }, [firebaseUid, settings, wallet]);

  const updateSettings = useCallback(
    (nextSettings: PlutoSettings) => {
      setSettings(nextSettings);
      setWallet((current) => ({ ...current, network: nextSettings.network }));
      if (firebaseUid) {
        void saveFirebaseSettings(firebaseUid, nextSettings).catch(() => setBackendLabel("Firebase write issue"));
      }
    },
    [firebaseUid]
  );

  const processMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      addMessage({ role: "user", text: trimmed });
      setOrbState("thinking");

      const contactDraftFromCommand = parseContactDraftCommand(trimmed);
      if (contactDraftFromCommand) {
        const reply = contactDraftFromCommand.name
          ? `I started a contact card for ${contactDraftFromCommand.name}. Review the wallet address and save it when it looks right.`
          : "I opened a new contact card. Add the name and Solana wallet address, then save it.";

        window.setTimeout(() => {
          setOrbState("speaking");
          addMessage({ role: "pluto", text: reply });
          void speak(reply);
        }, 260);

        setContactEditorMode("add");
        setContactDraft(contactDraftFromCommand);
        setSelectedContact(undefined);
        setConversationState("idle");
        setPendingIntent(undefined);
        window.setTimeout(() => {
          setOrbState("idle");
          setScreen("contact-editor");
        }, 520);
        return;
      }

      const result = handleConversationMessage(trimmed, {
        contacts,
        wallet,
        state: conversationState,
        pendingIntent
      });

      window.setTimeout(() => {
        if (!result.pendingTransaction && !result.paymentRequest && result.intent.intent !== "receive" && result.intent.intent !== "contacts") {
          setOrbState(result.nextState === "error" ? "idle" : "speaking");
        }
        addMessage({
          role: "pluto",
          text: result.reply,
          choices: result.contactChoices,
          variant: result.nextState === "error" ? "error" : "normal"
        });
        void speak(result.reply);
      }, 360);

      setConversationState(result.nextState);
      setPendingIntent(
        ["collecting_amount", "collecting_recipient", "disambiguating_contact"].includes(result.nextState)
          ? result.intent
          : undefined
      );

      if (result.pendingTransaction) {
        setPendingTransaction(result.pendingTransaction);
        setOrbState("confirming");
        window.setTimeout(() => setScreen("confirm"), 760);
      } else if (result.paymentRequest) {
        setPaymentRequest(result.paymentRequest);
        setOrbState("success");
        if (firebaseUid) {
          void saveFirebasePaymentRequest(firebaseUid, result.paymentRequest).catch(() => setBackendLabel("Firebase write issue"));
        }
        window.setTimeout(() => setScreen("request"), 760);
      } else if (result.intent.intent === "receive") {
        setOrbState("idle");
        window.setTimeout(() => setScreen("receive"), 520);
      } else if (result.intent.intent === "contacts") {
        setOrbState("idle");
        window.setTimeout(() => setScreen("contacts"), 520);
      } else {
        window.setTimeout(() => setOrbState("idle"), 900);
      }

      if (result.revealHome) {
        window.setTimeout(() => setHomeRevealed(true), 500);
      }
    },
    [addMessage, contacts, conversationState, firebaseUid, pendingIntent, speak, wallet]
  );

  const chooseContact = useCallback(
    (contact: Contact) => {
      processMessage(contact.name);
    },
    [processMessage]
  );

  const openContact = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setScreen("contact-detail");
  }, []);

  const openAddContact = useCallback((draft?: ContactEditorDraft) => {
    setContactEditorMode("add");
    setContactDraft(draft);
    setSelectedContact(undefined);
    setScreen("contact-editor");
  }, []);

  const openEditContact = useCallback((contact: Contact) => {
    setContactEditorMode("edit");
    setContactDraft(contact);
    setSelectedContact(contact);
    setScreen("contact-editor");
  }, []);

  const saveContact = useCallback(
    (contact: Contact) => {
      setContacts((current) => {
        const exists = current.some((item) => item.id === contact.id);
        return exists ? current.map((item) => (item.id === contact.id ? contact : item)) : [contact, ...current];
      });
      setSelectedContact(contact);
      setContactDraft(contact);
      addMessage({
        role: "pluto",
        text: `${contact.name} is saved in your Pluto contacts.`,
        variant: "success"
      });
      if (firebaseUid) {
        void saveFirebaseContact(firebaseUid, contact).catch(() => setBackendLabel("Firebase write issue"));
      }
      setScreen("contact-detail");
    },
    [addMessage, firebaseUid]
  );

  const removeContact = useCallback(
    (contact: Contact) => {
      setContacts((current) => current.filter((item) => item.id !== contact.id));
      setSelectedContact(undefined);
      setContactDraft(undefined);
      addMessage({
        role: "pluto",
        text: `${contact.name} has been removed from your contacts.`
      });
      if (firebaseUid) {
        void removeFirebaseContact(firebaseUid, contact.id).catch(() => setBackendLabel("Firebase write issue"));
      }
      setScreen("contacts");
    },
    [addMessage, firebaseUid]
  );

  const openActivity = useCallback((activity: Activity) => {
    setSelectedActivity(activity);
    setScreen("activity-detail");
  }, []);

  const repeatActivity = useCallback(
    (activity: Activity) => {
      const amount = Math.abs(activity.amountSol).toFixed(2);
      const memo = activity.memo ? ` for ${activity.memo}` : "";
      setScreen("app");
      setHomeRevealed(false);
      processMessage(
        activity.amountSol > 0
          ? `Request ${amount} SOL from ${activity.contactName}${memo}`
          : `Send ${amount} SOL to ${activity.contactName}${memo}`
      );
    },
    [processMessage]
  );

  const sendToContact = useCallback(
    (contact: Contact) => {
      setScreen("app");
      setHomeRevealed(false);
      processMessage(`Send SOL to ${contact.name}`);
    },
    [processMessage]
  );

  const requestFromContact = useCallback(
    (contact: Contact) => {
      setScreen("app");
      setHomeRevealed(false);
      processMessage(`Request SOL from ${contact.name}`);
    },
    [processMessage]
  );

  const confirmSend = useCallback(async () => {
    if (!pendingTransaction) return;
    setIsSending(true);
    navigator.vibrate?.(30);

    try {
      const response = await fetch("/api/solana/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountSol: pendingTransaction.amountSol,
          toPublicKey: pendingTransaction.recipient.walletAddress,
          memo: pendingTransaction.memo,
          recipientAlias: pendingTransaction.recipient.name,
          demoMode: wallet.demoMode
        })
      });

      const data = (await response.json()) as {
        signature?: string;
        programId?: string;
        transactionRecord?: string;
        error?: string;
      };
      if (!response.ok || !data.signature) throw new Error(data.error || "Transaction failed");

      const activity: Activity = {
        id: messageId("activity"),
        type: "send",
        title: `Sent to ${pendingTransaction.recipient.name}`,
        timestamp: "Just now",
        amountSol: -pendingTransaction.amountSol,
        contactName: pendingTransaction.recipient.name,
        signature: data.signature,
        memo: pendingTransaction.memo,
        network: pendingTransaction.network,
        counterpartyAddress: pendingTransaction.recipient.walletAddress,
        feeSol: pendingTransaction.feeSol,
        status: "confirmed",
        programId: data.programId,
        transactionRecord: data.transactionRecord
      };

      setSignature(data.signature);
      setActivities((current) => [activity, ...current]);
      if (firebaseUid) {
        void saveFirebaseActivity(firebaseUid, activity).catch(() => setBackendLabel("Firebase write issue"));
      }
      setOrbState("success");
      navigator.vibrate?.([35, 30, 35]);
      setScreen("success");
    } catch {
      navigator.vibrate?.([60, 30, 60]);
      addMessage({
        role: "pluto",
        text: "Transaction failed. No funds were sent.",
        variant: "error"
      });
      setScreen("app");
      setOrbState("idle");
    } finally {
      setIsSending(false);
    }
  }, [addMessage, firebaseUid, pendingTransaction, wallet.demoMode]);

  const doneAfterSuccess = useCallback(() => {
    if (pendingTransaction) {
      const text = `Done. I sent ${pendingTransaction.amountSol.toFixed(2)} SOL to ${pendingTransaction.recipient.name}.`;
      addMessage({ role: "pluto", text, variant: "success" });
      void speak(text);
    }
    setHomeRevealed(false);
    setOrbState("idle");
    setScreen("app");
  }, [addMessage, pendingTransaction, speak]);

  const defaultRequest = useMemo<PaymentRequest>(
    () => ({
      id: "request-demo",
      amountSol: 0.5,
      token: "SOL",
      fromName: "Alex",
      memo: "Lunch",
      network: "devnet",
      paymentUrl: `solana:${wallet.publicKey}?amount=0.5&label=Pluto&message=Lunch`
    }),
    [wallet.publicKey]
  );

  const activeContact = selectedContact
    ? contacts.find((contact) => contact.id === selectedContact.id) || selectedContact
    : undefined;
  const activeActivity = selectedActivity
    ? activities.find((activity) => activity.id === selectedActivity.id) || selectedActivity
    : undefined;

  if (screen === "splash") return <SplashScreen />;
  if (screen === "onboarding") {
    return (
      <Onboarding
        onCreateWallet={() => setScreen("auth")}
        onImportWallet={() => setScreen("import-wallet")}
        onDemo={enterDemo}
      />
    );
  }
  if (screen === "auth") return <AuthScreen onContinue={handleAuthContinue} onDemo={enterDemo} />;
  if (screen === "create-wallet") return <CreateWalletScreen onBack={() => setScreen("auth")} onContinue={continueWalletSetup} />;
  if (screen === "import-wallet") return <ImportWalletScreen onBack={() => setScreen("onboarding")} onContinue={continueWalletSetup} />;
  if (screen === "pin") return <PinScreen onContinue={enterAppAfterSetup} />;
  if (screen === "confirm" && pendingTransaction) {
    return (
      <ConfirmationScreen
        transaction={pendingTransaction}
        isSending={isSending}
        onBack={() => {
          addMessage({ role: "pluto", text: "No problem. I cancelled the transaction." });
          setScreen("app");
          setOrbState("idle");
        }}
        onConfirm={confirmSend}
      />
    );
  }
  if (screen === "success" && pendingTransaction) {
    return (
      <SuccessScreen
        transaction={pendingTransaction}
        signature={signature || "demo-signature-devnet"}
        onDone={doneAfterSuccess}
        onSendAgain={() => setScreen("confirm")}
      />
    );
  }
  if (screen === "receive") return <ReceiveScreen wallet={wallet} onBack={() => setScreen("app")} />;
  if (screen === "request") {
    return <RequestPaymentScreen request={paymentRequest || defaultRequest} onBack={() => setScreen("app")} />;
  }
  if (screen === "contacts") {
    return (
      <ContactsScreen
        contacts={contacts}
        onBack={() => setScreen("app")}
        onAddContact={() => openAddContact()}
        onSelectContact={openContact}
      />
    );
  }
  if (screen === "contact-detail" && activeContact) {
    return (
      <ContactDetailScreen
        contact={activeContact}
        onBack={() => setScreen("contacts")}
        onSend={sendToContact}
        onRequest={requestFromContact}
        onEdit={openEditContact}
        onRemove={removeContact}
      />
    );
  }
  if (screen === "contact-editor") {
    return (
      <ContactEditorScreen
        mode={contactEditorMode}
        draft={contactEditorMode === "edit" ? contactDraft || activeContact : contactDraft}
        onBack={() => {
          if (contactEditorMode === "edit" && activeContact) {
            setScreen("contact-detail");
          } else {
            setScreen("contacts");
          }
        }}
        onSave={saveContact}
      />
    );
  }
  if (screen === "activity-detail" && activeActivity) {
    return (
      <ActivityDetailScreen
        activity={activeActivity}
        wallet={wallet}
        onBack={() => setScreen("app")}
        onRepeat={repeatActivity}
      />
    );
  }
  if (screen === "add-funds") {
    return (
      <AddFundsScreen
        wallet={wallet}
        onBack={() => setScreen("app")}
        onReceive={() => setScreen("receive")}
      />
    );
  }
  if (screen === "settings") {
    return (
      <SettingsScreen
        wallet={wallet}
        settings={settings}
        backendLabel={backendLabel}
        onSettingsChange={updateSettings}
        onBack={() => setScreen("app")}
      />
    );
  }

  return (
    <main className="relative mx-auto h-[100dvh] max-w-md overflow-hidden bg-[radial-gradient(circle_at_50%_-15%,rgba(10,132,255,0.18),transparent_22rem),linear-gradient(180deg,#ffffff_0%,#f7fbff_54%,#eef7ff_100%)]">
      <HomeLayer
        wallet={wallet}
        contacts={contacts}
        activities={activities}
        onReceive={() => setScreen("receive")}
        onSend={() => {
          setHomeRevealed(false);
          processMessage("Send SOL");
        }}
        onRequest={() => {
          setHomeRevealed(false);
          processMessage("Request SOL");
        }}
        onAddFunds={() => setScreen("add-funds")}
        onAddContact={() => openAddContact()}
        onContacts={() => setScreen("contacts")}
        onContact={openContact}
        onActivity={openActivity}
        onSettings={() => setScreen("settings")}
      />
      <VoiceLayer
        messages={messages}
        isHomeRevealed={homeRevealed}
        orbState={orbState}
        onRevealChange={setHomeRevealed}
        onSendMessage={processMessage}
        onSystemMessage={(text, variant) => addMessage({ role: "pluto", text, variant })}
        onChooseContact={chooseContact}
        onAddContact={() => openAddContact()}
        onSettings={() => setScreen("settings")}
      />
      {process.env.NODE_ENV !== "production" ? (
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-30 flex justify-center">
          <div className="pointer-events-auto rounded-full border border-pluto-line bg-white/90 p-1 shadow-sm backdrop-blur">
            <Button variant="ghost" size="sm" onClick={enterDemo}>
              Demo reset
            </Button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
