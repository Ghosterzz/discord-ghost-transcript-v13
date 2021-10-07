export function fetchTranscript(
    message: Message,
    numberOfMessages: number,
    sendToAuthor: boolean,
    options?: {
        inverseArray?: boolean;
        dateFormat?: string;
        dateLocale?: string;
        customTitle?: string;
        customDescription?: string;
    }
);