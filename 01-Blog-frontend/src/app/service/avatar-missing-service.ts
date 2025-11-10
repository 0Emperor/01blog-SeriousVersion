import { Injectable } from '@angular/core';
import { User } from '../dto/dto';

@Injectable({
  providedIn: 'root'
})
export class AvatarMissingService {
  readonly profile_base = "http://localhost:8080/api/files/"
  public avatar_link(avatar: string) {
    return  avatar;
  }
  private colors = [
    'black', 'white', 'gray',
    'red', 'orange', 'yellow',
    'green', 'blue', 'purple',
    'pink', 'brown'
  ];

  /**
   * Extracts the first letter of the username for the avatar placeholder.
   */
  public getInitial(name: string): string {

    if (!name) return "";

    // Trim and split by one or more spaces
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      // Take first letter of the first two parts
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    const single = parts[0];
    if (single.length === 1) return single[0].toUpperCase();

    // If only one word, take first and last letter
    return (single[0] + single[single.length - 1]).toUpperCase();
  }


  /**
   * Selects a consistent background color based on the username string (simple hash).
   */
  public getBackgroundColor(username: string): string {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      // Simple non-cryptographic hash function
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
      hash |= 0;
    }
    // Map the hash to an index in the color array
    const index = Math.abs(hash) % this.colors.length;
    return this.colors[index];
  }
  public getImageClass(isAdmin: boolean, isBanned: boolean): string;
  public getImageClass(user: User): string;

  public getImageClass(arg1: any, arg2?: any): string {
    let isAdmin: boolean;
    let isBanned: boolean;

    if (typeof arg1 === 'object') {
      isAdmin = arg1.role === 'ADMIN'
      isBanned = arg1.isBaned
    } else {
      isAdmin = arg1;
      isBanned = arg2
    }
    if (isAdmin) {
      return "admin";
    }
    if (isBanned) {
      return "banned"
    }
    return "active"
  }

}
