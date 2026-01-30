import { randomUUID } from 'crypto';
import createError from 'http-errors';
import { RegisteredUrl, UrlStatus } from '../models';

// In-memory store for registered URLs using a Map for efficient lookups
const registeredUrls = new Map<string, RegisteredUrl>();

/**
 * Validates and stores a new URL as a RegisteredUrl object.
 * @param url The URL string to register.
 * @returns The newly created RegisteredUrl object.
 * @throws An error if the URL is invalid or already registered.
 */
export const registerUrl = (url: string): RegisteredUrl => {
  let parsedUrl: URL;

  // Basic validation for a valid URL format
  try {
    parsedUrl = new URL(url);
  } catch (error) {
    throw createError(400, 'Invalid URL format.');
  }

  const normalizedUrl = parsedUrl.href;

  // Check if the URL is already registered
  if (registeredUrls.has(normalizedUrl)) {
    throw createError(409, 'URL is already registered.');
  }

  // Create a new RegisteredUrl object
  const newUrlEntry: RegisteredUrl = {
    id: randomUUID(),
    link: normalizedUrl,
    status: UrlStatus.PENDING,
  };

  registeredUrls.set(normalizedUrl, newUrlEntry);
  return newUrlEntry;
};

/**
 * Retrieves all registered URLs.
 * @returns An array of RegisteredUrl objects.
 */
export const getAllUrls = (): RegisteredUrl[] => {
  return Array.from(registeredUrls.values());
};

/**
 * Updates the status or metadata of a registered URL.
 * @param id The unique ID of the URL to update.
 * @param updates An object containing the fields to update.
 * @returns The updated RegisteredUrl object.
 * @throws An error if the URL ID is not found.
 */
export const updateUrl = (id: string, updates: Partial<RegisteredUrl>): RegisteredUrl => {
  // Find the URL entry by ID
  const urlEntry = Array.from(registeredUrls.values()).find((entry) => entry.id === id);

  if (!urlEntry) {
    throw createError(404, 'URL not found.');
  }

  // Update the fields in the URL entry
  const updatedUrlEntry = { ...urlEntry, ...updates };

  // Update the Map with the new entry
  registeredUrls.set(updatedUrlEntry.link, updatedUrlEntry);

  return updatedUrlEntry;
};

/**
 * Updates the status or metadata of a registered URL by its URL string.
 * @param url The URL string to update.
 * @param updates An object containing the fields to update.
 * @returns The updated RegisteredUrl object.
 * @throws An error if the URL is not found.
 */
export const updateUrlByLink = (url: string, updates: Partial<RegisteredUrl>): RegisteredUrl => {
  // Check if the URL is already registered
  const urlEntry = registeredUrls.get(url);

  if (!urlEntry) {
    throw createError(404, 'URL not found.');
  }

  // Update the fields in the URL entry
  const updatedUrlEntry = { ...urlEntry, ...updates };

  // Update the Map with the new entry
  registeredUrls.set(url, updatedUrlEntry);

  return updatedUrlEntry;
};
