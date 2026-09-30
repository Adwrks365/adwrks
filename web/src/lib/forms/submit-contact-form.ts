"use client";

type SubmitContactFormInput = Record<string, FormDataEntryValue | undefined> & {
  formId: string;
  pageTitle?: string;
  pagePath?: string;
};

export type ContactFormResponse = {
  ok?: boolean;
  message?: string;
};

export async function submitContactForm(
  input: SubmitContactFormInput,
): Promise<{ ok: boolean; message: string; status: number }> {
  const payload: Record<string, unknown> = { ...input };

  if (typeof window !== "undefined") {
    payload.pageUrl = window.location.href;
    payload.pagePath = input.pagePath || window.location.pathname;
    payload.pageTitle = input.pageTitle || document.title;
  }

  const res = await fetch("/api/contact/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await res.json()) as ContactFormResponse;
  return {
    ok: Boolean(res.ok && json.ok),
    message: json.message || "לא ניתן לשלוח את הטופס כרגע.",
    status: res.status,
  };
}
