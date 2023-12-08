import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface PreferenceDoc extends BaseDoc {
  user: ObjectId;
  interval: number; // number of days bertween re-prompting about updating preferences
  expiry: number; // next date to prompt about updating preferences
  timeCapsule: number; //number of days after login to release time capsule
  fontSize: string; // set the font size across the application
  age: string;
  visualAid: boolean;
}

export default class PreferenceConcept {
  public readonly preferences = new DocCollection<PreferenceDoc>("preferences");

  // default values for a PreferenceDoc
  private readonly interval = 7;
  private readonly timeCapsule = 14;
  private readonly fontSize = "default";

  /**
   * Initialize a set of preferences for a user to the default values listed above.
   * @param user ObjectId associated with a user
   * @returns a PreferenceDoc w/ expiry= current time + interval
   */
  async initialize(user: ObjectId) {
    const _id = await this.preferences.createOne({ user, interval: this.interval, expiry: Date.now() + this.interval, timeCapsule: this.timeCapsule, fontSize: this.fontSize });
    return { msg: "Initialized User preferences.", preferences: await this.preferences.readOne({ _id }) };
  }

  /**
   * Helper function to get the PreferenceDoc associated w/ a specific user
   * @param user ObjectId associated with a user
   * @returns PreferenceDoc that is associated w/ 'user'
   */
  async getUserPreferences(user: ObjectId) {
    const userPreferences = await this.preferences.readOne({ user });
    if (!userPreferences) {
      throw new NotFoundError("No preferences found for this user.");
    }
    return userPreferences;
  }

  /**
   * Create or Update a preference for a specific user
   * @param user ObjectId associated with a user
   * @param update partial of PreferenceDoc representing update(s)
   * @returns modifies 'this.preferences'
   */
  async updatePreference(user: ObjectId, update: Partial<PreferenceDoc>) {
    await this.preferences.updateOne({ user }, update);
    return { msg: "Updated preferences.", preferences: await this.preferences.readOne({ user }) };
  }

  /**
   * Reset all preferences for a user
   * @param user ObjectId associated with a user
   * @returns updates 'this.preferences.features' to {}
   */
  async resetPreferences(user: ObjectId) {
    const defaults: Partial<PreferenceDoc> = { interval: this.interval, timeCapsule: this.timeCapsule, fontSize: this.fontSize };
    await this.preferences.updateOne({ user }, defaults);
    return { msg: "Reset all user preferences." };
  }

  /**
   * Checks whether the current interval has expired based on a user's interval and expiry.
   * This function will be used to prompt the user about updating their preferences.
   *
   * @param user ObjectId associated with a user
   * @returns true iff the current date is past the expiry date.
   */
  async isExpired(user: ObjectId) {
    const userPref = await this.getUserPreferences(user);
    return Date.now() >= userPref.expiry;
  }

  // /**
  //  * Change the amount of time between prompting a user to update their preferences
  //  * @param user ObjectId associated with a user
  //  * @param interval (updated) amount of time for users to be prompted about preferences
  //  * @returns updates 'this.preferences.interval' to interval
  //  */
  // async changeInterval(user: ObjectId, interval: number) {
  //   await this.preferences.updateOne({ user }, { interval });
  //   return { msg: "Changed user's preference interval." };
  // }

  // /**
  //  * Updates the expiry date for a user
  //  * @param user ObjectId associated with a user
  //  * @returns sets 'this.preferences.expiry' = current time + 'this.preferences.interval'
  //  */
  // async updateExpiry(user: ObjectId) {
  //   const userPref = await this.getUserPreferences(user);
  //   await this.preferences.updateOne({ user }, { expiry: Date.now() + userPref.interval });
  //   return { msg: "Updated Preferences' expiry" };
  // }
}
