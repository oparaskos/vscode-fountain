import { logger } from '@/utils/logger';
import * as defaultMessages from '_assets/i18n/en.json';

export class I18n {
    private static _listeners: (()=>void)[] = [];
    private static _offlineMessages: Record<string, Record<string, string> | null> = {
        en: defaultMessages
    };
    private static _messages: Record<string, Promise<Record<string, string>> | null> = {
        en: Promise.resolve(defaultMessages)
    };

    public static defaultLocale = new Intl.Locale(
        document.getElementsByTagName('html')[0].getAttribute('lang') ?? window.navigator.language
    );

    static async messages(locale: Intl.Locale) {
        const _locale = locale.baseName;
        if (!I18n._messages[_locale]) {
            I18n._messages[_locale] = this.fetchMessages(locale);
            I18n._messages[_locale]?.then((v) => {
                I18n._offlineMessages[_locale] = v;
                I18n._listeners.forEach(it => it());
            });
        }
        return await I18n._messages[_locale];
    }

    static async fetchMessages(locale: Intl.Locale) {
        const _locale = locale.baseName;

        const response = await fetch(`i18n/${_locale}.json`);
        if (response.ok) {
            return response.json();
        } else {
            if (await I18n._messages[locale.language]) {
                return await I18n._messages[locale.language];
            }
            const response = await fetch(`i18n/${locale.language}.json`);
            if (response.ok) {
                logger.trace(`using 'i18n/${locale.language}.json' for ${_locale}`);
                return response.json();
            } else {
                logger.warn(`No messages for from i18n/${_locale}.json, using default messages`);
                return defaultMessages;
            }
        }
    }

    static async getMessage(messageKey: string, locale?: Intl.Locale) {
        return I18n.getMessageOrDefault(messageKey, null, locale);
    }

    static async getMessageOrDefault<T>(messageKey: string, defaultValue: T, locale?: Intl.Locale) {
        const lookupLocale = locale || I18n.defaultLocale;
        const messages = await I18n.messages(lookupLocale);
        const replacementValue = messages?.[messageKey];
        if(!replacementValue) {
            logger.warn(`No translation string for message key ${messageKey} in ${lookupLocale}; defaulting to ${defaultValue}`);
        }
        return replacementValue || defaultValue;
    }

    static getOfflineMessage(messageKey: string, locale?: Intl.Locale) {
        return I18n.getOfflineMessageOrDefault(messageKey, null, locale);
    }

    static getOfflineMessageOrDefault<T>(messageKey: string | null | undefined, defaultValue: T, locale?: Intl.Locale) {
        if(!messageKey) return defaultValue;
        const lookupLocale = locale || I18n.defaultLocale;
        const messages: Record<string, string> = I18n._offlineMessages[lookupLocale.baseName] || defaultMessages;
        const replacementValue = messages[messageKey];
        if(!replacementValue) {
            logger.warn(`No translation string for message key ${messageKey} in default messages; defaulting to ${defaultValue}`);
        }
        return replacementValue || defaultValue;
    }
    static onTranslationsAvailable(callback: () => void) {
        I18n._listeners.push(callback);
    }
}

export type MessageKey = keyof typeof defaultMessages;

export function $translate(messageKey: MessageKey, locale?: Intl.Locale): string {
    return translate(messageKey, defaultMessages[messageKey], locale);
}

export function $translateWithArguments(messageKey: MessageKey, replacements?: Record<string, string | {toString:()=>string}|undefined>, locale?: Intl.Locale): string {
    let translationMessage = $translate(messageKey, locale);
    if (replacements && typeof translationMessage === "string") [
        Object.entries(replacements).forEach(([key, value]) => {
            translationMessage = (translationMessage as string).replaceAll(`{{${key}}}`, value?.toString() ?? '∅');
        })
    ];
    return translationMessage;
}

export function translate(messageKey: string, defaultValue: string = messageKey, locale?: Intl.Locale): string {
    const realMessageKey = messageKey?.replace(/\s+/ig, '_')?.replace(/[^\w]+/ig, '')?.toUpperCase();
    return I18n.getOfflineMessageOrDefault(realMessageKey, defaultValue ?? messageKey, locale);
}

export const $t = $translateWithArguments;
