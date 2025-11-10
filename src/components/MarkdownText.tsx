/**
 * MarkdownText - Componente para renderizar texto en formato markdown
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import theme from '@/theme/theme';

interface MarkdownTextProps {
  children: string;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ children }) => {
  return <Markdown style={markdownStyles}>{children}</Markdown>;
};

const markdownStyles = StyleSheet.create({
  body: {
    ...theme.typography.body,
    color: theme.colors.gray600,
    lineHeight: 24,
  },
  heading1: {
    ...theme.typography.h2,
    color: theme.colors.ink,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  heading2: {
    ...theme.typography.h3,
    color: theme.colors.ink,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  heading3: {
    ...theme.typography.h4,
    color: theme.colors.ink,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  paragraph: {
    ...theme.typography.body,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.sm,
    lineHeight: 24,
  },
  strong: {
    fontWeight: '700',
    color: theme.colors.ink,
  },
  em: {
    fontStyle: 'italic',
  },
  list_item: {
    ...theme.typography.body,
    color: theme.colors.gray600,
    marginBottom: 4,
    lineHeight: 24,
  },
  bullet_list: {
    marginBottom: theme.spacing.sm,
  },
  ordered_list: {
    marginBottom: theme.spacing.sm,
  },
  code_inline: {
    ...theme.typography.caption,
    backgroundColor: theme.colors.background,
    color: theme.colors.primary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    fontFamily: 'monospace',
  },
  code_block: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  fence: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  blockquote: {
    backgroundColor: theme.colors.paperLight,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  hr: {
    backgroundColor: theme.colors.border,
    height: theme.borderWidth.medium,
    marginVertical: theme.spacing.md,
  },
});
