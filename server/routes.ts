import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Contact, Delay, Diary, Email, Friend, Letter, Mood, Post, Preference, Topic, User, WebSession, Wish } from "./app";
import { DelayDoc } from "./concepts/delay";
import { DiaryDoc } from "./concepts/diary";
import { NotAllowedError } from "./concepts/errors";
import { MoodDoc } from "./concepts/mood";
import { PostDoc, PostOptions } from "./concepts/post";
import { PreferenceDoc } from "./concepts/preferences";
import { TopicDoc } from "./concepts/topic";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import { WishDoc } from "./concepts/wish";
import Responses from "./responses";

//===============================================================
// HELPER FUNCTIONS FOR ROUTES
//===============================================================
async function timeCapsuleByOwner(user: ObjectId) {
  return (await Delay.getDelaysByOwner(user)).filter((delay) => Delay.isTimeCapsule(delay._id));
}

class Routes {
  // ############################################################
  // session
  // ############################################################
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  // ############################################################
  // user
  // ############################################################
  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    const output = await User.create(username, password);
    await Preference.initialize(output.user!._id); // initialzie preferences for a user upon creation
    return output;
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/user/username/:_id")
  async getUsernameById(_id: ObjectId) {
    return (await User.getUserById(_id)).username;
  }

  // ############################################################
  // post
  // ############################################################
  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.get("/posts/:_id")
  async getPostById(_id: ObjectId) {
    return await Responses.post(await Post.getById(_id));
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  // ############################################################
  // friend
  // ############################################################
  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  // ############################################################
  // wish
  // ############################################################
  @Router.get("/wishes")
  async getWishes(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.wishes(await Wish.getByAuthor(user));
  }

  @Router.get("/wishes/author/:author")
  async getWishByAuthor(username: string) {
    const user = (await User.getUserByUsername(username))._id;
    return await Responses.wishes(await Wish.getByAuthor(user));
  }

  @Router.get("/wishes/:_id")
  async getWishById(_id: ObjectId) {
    return await Responses.wish(await Wish.getWishById(_id));
  }

  @Router.post("/wishes")
  async createWish(session: WebSessionDoc, content: string, visibility: "public" | "contacts" | "private") {
    const user = WebSession.getUser(session);
    const created = await Wish.create(user, content, visibility);
    return { msg: created.msg, wish: await Responses.wish(created.wish) };
  }

  @Router.patch("/wishes/:_id")
  async updatewish(session: WebSessionDoc, _id: ObjectId, update: Partial<WishDoc>) {
    const user = WebSession.getUser(session);
    await Wish.isAuthor(user, _id);
    return await Wish.update(_id, update);
  }

  @Router.delete("/wishes/:_id")
  async deletewish(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Wish.isAuthor(user, _id);
    return Wish.delete(_id);
  }

  // ############################################################
  // Topic/Forum
  // ############################################################
  @Router.get("/topics")
  async getTopics(page?: number, pagesize?: number) {
    // default page = 1, pagesize = 10
    const currentPage = page || 1;
    const pageSize = pagesize || 10;
    const totoalCount = await Topic.topics.count({});
    const pageCount = Math.ceil(totoalCount / pageSize);
    return { topics: await Responses.topics(await Topic.getNextTopics(currentPage, pageSize)), page: currentPage, pageSize: pageSize, totalPage: pageCount, totalCount: totoalCount };
  }

  @Router.get("/topics/:_id")
  async getTopicById(_id: ObjectId) {
    return await Responses.topic(await Topic.getById(_id));
  }

  @Router.post("/topics")
  async createTopic(session: WebSessionDoc, title: string, content: string) {
    const user = WebSession.getUser(session);
    const created = await Topic.create(user, title, content);
    return { msg: created.msg, topic: await Responses.topic(created.topic) };
  }

  @Router.patch("/topics/:_id")
  async updateTopic(session: WebSessionDoc, _id: ObjectId, update: Partial<TopicDoc>) {
    const user = WebSession.getUser(session);
    await Topic.isAuthor(user, _id);
    return await Topic.update(_id, update);
  }

  @Router.delete("/topics/:_id")
  async deleteTopic(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Topic.isAuthor(user, _id);
    return Topic.delete(_id);
  }

  @Router.post("/topic/:_id/post")
  async addPostToTopic(_id: ObjectId, post: ObjectId) {
    return await Topic.addPost(_id, post);
  }

  @Router.delete("topic/:_id/post")
  async removePostFromTopic(session: WebSessionDoc, _id: ObjectId, post: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, post);
    // sync delete post
    await Post.delete(post);
    return await Topic.removePost(_id, post);
  }
  // ############################################################
  // Diary
  // ############################################################
  @Router.post("/diary")
  async createDiary(session: WebSessionDoc, content: string, hidden: boolean) {
    const user = WebSession.getUser(session);
    const created = await Diary.create(user, content, hidden);
    return await Responses.diary(created.diary);
  }

  @Router.get("/diary/entries/:username")
  async getEntriesByAuthor(username: string) {
    const author = (await User.getUserByUsername(username))._id;
    const entries = await Diary.getEntriesByAuthor(author);
    return Responses.diaries(entries);
  }

  @Router.get("/diary/:_id")
  async getDiaryById(_id: ObjectId) {
    return Responses.diary(await Diary.getEntryById(_id));
  }

  @Router.get("/diary/hidden/:_id")
  async isDiaryHidden(_id: ObjectId) {
    return await Diary.isHidden(_id);
  }

  @Router.delete("/diary/:_id")
  async deleteDiary(session: WebSessionDoc, _id: ObjectId) {
    return await Diary.delete(_id);
  }

  @Router.patch("/diary/:_id")
  async modifyDiary(session: WebSessionDoc, _id: ObjectId, update: Partial<DiaryDoc>) {
    return await Diary.update(_id, update);
  }
  // ############################################################
  // Delay
  // ############################################################
  @Router.post("/delay/:contentID")
  async createDelay(session: WebSessionDoc, contentID: ObjectId, type: "Diary" | "Letter", behavior: "send" | "delete", activation: Date) {
    const user = WebSession.getUser(session);
    return await Delay.create(user, contentID, type, behavior, activation);
  }

  @Router.get("/delay/:_id")
  async getDelayById(_id: ObjectId) {
    return await Delay.getDelayById(_id);
  }

  @Router.get("/delay/content/:_id")
  async getDelayByContents(_id: ObjectId) {
    return await Delay.getDelayByContent(_id);
  }

  @Router.get("/delay/content/:contentID")
  async getDelayByContent(contentID: ObjectId) {
    contentID = new ObjectId(contentID);
    return await Delay.getDelayByContent(contentID);
  }

  @Router.get("/delay/owner")
  async getDelaysByUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Delay.getDelaysByOwner(user);
  }

  @Router.get("/delay/expired/:_id")
  async isDelayExpired(_id: ObjectId) {
    return await Delay.isExpired(_id);
  }

  @Router.delete("/delay/:_id")
  async deleteDelay(session: WebSessionDoc, _id: ObjectId) {
    return await Delay.delete(_id);
  }

  @Router.delete("delay/content/:_id")
  async deleteDelayByContent(_id: ObjectId, behavior: "send" | "delete" | "reveal" | "hide" = "send") {
    return await Delay.deletedelayByContent(_id, behavior);
  }

  @Router.patch("/delay/:_id")
  async updateDelay(session: WebSessionDoc, _id: ObjectId, update: Partial<DelayDoc>) {
    return await Delay.updateDelay(_id, update);
  }

  /**System function**/
  @Router.delete("/delay/executed/:_id")
  async executeDelay(_id: ObjectId) {
    const delay = await Delay.getDelayById(_id);
    await Delay.delete(_id); // want to delete Delay upon execution (whether it throws error or not)
    if (delay.type === "Diary") {
      if (delay.behavior === "send") {
        return await Diary.update(delay.content, { hidden: false });
      } else if (delay.behavior === "delete") {
        return await Diary.delete(delay.content);
      } else {
        throw new NotAllowedError(`Behavior "${delay.behavior}" is not supported for a Delayed Diary.`);
      }
    } else if (delay.type === "Letter") {
      if (delay.behavior === "send") {
        const the_letter = await Letter.getLetterById(delay.content);
        const username = (await User.getUserById(the_letter.from)).username;
        await Letter.sendLetter(the_letter._id);
        const thereceiver = the_letter.to;
        for (const receiver of thereceiver) {
          if ((await Contact.checkContactType(the_letter.from, receiver)) === "NonUser") {
            const receiveremail = await Contact.getemailaddressbyId(receiver);
            if (receiveremail === undefined) {
              continue;
            }
            await Email.send(username, receiveremail, the_letter.content);
          }
        }
        return { msg: "Letter sent!" };
      } else {
        throw new NotAllowedError(`Behavior "${delay.behavior}" is not supported for a Delayed Letter.`);
      }
    } else {
      throw new NotAllowedError(`Delay does not currently support content of type ${delay.type}.`);
    }
  }

  // ############################################################
  // Time Capsule: Delay + Diary + Letter
  // ############################################################
  @Router.post("/timecapsule/:contentID")
  async addToTimeCapsule(username: string, contentID: ObjectId, type: "Diary" | "Letter" | "Wish", behavior: "send" | "delete") {
    const user = await User.getUserByUsername(username);
    contentID = new ObjectId(contentID);
    if (user.userType !== "patient") {
      throw new NotAllowedError("Non-patients do not have a Time Capsule");
    }
    return await Delay.create(user._id, contentID, type, behavior, new Date(0));
  }

  @Router.get("/timecapsule/:username")
  async getUserTimeCapsule(username: string) {
    const user = await User.getUserByUsername(username);
    if (user.userType !== "patient") {
      throw new NotAllowedError("Non-patients do not have a Time Capsule");
    }
    return await timeCapsuleByOwner(user._id);
  }

  @Router.get("/timecapsule/not_selected/:username")
  async getContentNotInTimeCapsule(username: string) {
    const user = await User.getUserByUsername(username);
    const timeCapsuleIDs = new Set((await timeCapsuleByOwner(user._id)).map((delay) => delay.content.toString()));
    const diaries = (await Diary.getEntriesByAuthor(user._id)).filter((diary) => !timeCapsuleIDs.has(diary._id.toString()));
    const wishes = (await Wish.getByAuthor(user._id)).filter((wish) => !timeCapsuleIDs.has(wish._id.toString()));
    return { diaries: await Responses.diaries(diaries), wishes: await Responses.wishes(wishes) };
  }

  /**System function**/
  @Router.delete("timecapsule/:username")
  async releaseTimeCapsule(username: string) {
    const user = await User.getUserByUsername(username);
    if (user.userType !== "patient") {
      throw new NotAllowedError("Non-patients do not have a Time Capsule");
    }
    const timeCapsule = await timeCapsuleByOwner(user._id);
    for (const delay of timeCapsule) {
      await Delay.delete(delay._id);
      switch (delay.type) {
        case "Diary":
          switch (delay.behavior) {
            case "send":
              return await Diary.update(delay.content, { hidden: false });
            case "delete":
              return await Diary.delete(delay.content);
            default:
              throw new NotAllowedError(`Delay does not currently support behavior of type ${delay.behavior}.`);
          }
        case "Letter":
          switch (delay.behavior) {
            case "send":
              return await Letter.sendLetter(delay.content);
            case "delete":
              return await Letter.deleteLetter_server(delay.content);
            default:
              throw new NotAllowedError(`Delay does not currently support behavior of type ${delay.behavior}.`);
          }
        default:
          throw new NotAllowedError(`Delay does not currently support content of type ${delay.type}.`);
      }
    }
  }

  // ############################################################
  // Letter
  // ############################################################
  //CHECK//
  @Router.post("/letter")
  async createLetter(session: WebSessionDoc, to: string[], content: string, responseEnabled: boolean, delay?: string) {
    const userids = [];
    for (const name of to) {
      try {
        const user = await User.getUserByUsername(name);
        userids.push(user._id);
      } catch (error) {
        const user = await Contact.getEmailContactbyUsername(name);
        if (user === null) {
          continue;
        }
        userids.push(user._id);
      }
    }
    const user = WebSession.getUser(session);
    const newletter = await Letter.createLetter(user, userids, content, responseEnabled);
    if (delay) {
      const delaydate = new Date(delay !== "0" ? delay : 0);
      if (newletter.letter !== null) {
        const letterdelay = await Delay.create(user, newletter.letter._id, "Letter", "send", delaydate);
        return { letter: newletter, delay: letterdelay };
      }
    }
    return newletter;
  }

  //CHECK//
  @Router.get("/letter")
  async getLetterbySender(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Letter.getLetterBySender(user);
  }

  //CHECK//
  @Router.get("/letter/receiver")
  async getLetterbyReceiver(user: ObjectId) {
    return await Letter.getLetterByReceiver(user);
  }

  //CHECK//
  @Router.get("/letter/:_id")
  async getLetterbyId(_id: ObjectId) {
    return await Letter.getLetterById(_id);
  }

  //CHECK//
  @Router.get("/letterunsent")
  async getAllunsendLetter(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Letter.getAllUnsentLetterbySender(user);
  }

  //CHECK//
  @Router.patch("/letter/:_id")
  async updateLetterContent(session: WebSessionDoc, _id: ObjectId, content: string, responseEnabled: boolean, delay?: string) {
    const user = WebSession.getUser(session);
    const theletter = await Letter.getLetterById(_id);
    if (theletter.from.toString() !== user.toString()) {
      throw new Error("You are not the author of this letter!");
    }
    await Letter.updateLetterContent(_id, content);
    await Letter.updateLetterResponseEnabled(_id, responseEnabled);
    if (delay) {
      const thedelay = await Delay.getDelayByContent(_id);
      if (thedelay !== null) {
        const delaydate = new Date(delay);
        await Delay.updateDelay(thedelay[0]._id, { activation: delaydate });
        return { msg: "Letter updated!", delay: thedelay };
      }
    }
    return { msg: "Letter updated with no delay!" };
  }

  //TODO//
  @Router.delete("/letter/receiver")
  async removeReceiver(session: WebSessionDoc, letter: ObjectId, receiver: ObjectId) {
    const user = WebSession.getUser(session);
    const theletter = await Letter.getLetterById(letter);
    if (theletter.from.toString() !== user.toString()) {
      throw new Error("You are not the sender of this letter!");
    }
    return await Letter.removeLetterReceiver(letter, receiver);
  }

  //TODO//
  @Router.patch("/letter/receiver")
  async addReceiver(session: WebSessionDoc, letter: ObjectId, receiver: ObjectId) {
    const user = WebSession.getUser(session);
    const theletter = await Letter.getLetterById(letter);
    if (theletter.from.toString() !== user.toString()) {
      throw new Error("You are not the sender of this letter!");
    }
    return await Letter.addLetterReceiver(letter, receiver);
  }

  //CHECK//
  @Router.patch("/letter/send/:_id")
  async sendLetter(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const theletter = await Letter.getLetterById(_id);
    const username = (await User.getUserById(user)).username;
    if (theletter.from.toString() !== user.toString()) {
      throw new Error("You are not the author of this letter!");
    }
    await Letter.sendLetter(_id);
    const thereceiver = theletter.to;
    for (const receiver of thereceiver) {
      if ((await Contact.checkContactType(user, receiver)) === "NonUser") {
        const receiveremail = await Contact.getemailaddressbyId(receiver);
        if (receiveremail === undefined) {
          continue;
        }
        await Email.send(username, receiveremail, theletter.content);
      }
    }
    return { msg: "Letter sent!" };
  }

  //check//
  @Router.get("/receiveletter")
  async receiveLetter(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Letter.receiveLetter(user);
  }

  @Router.patch("/letter/unshow")
  async unshowLetter(session: WebSessionDoc, letter: ObjectId) {
    const user = WebSession.getUser(session);
    const theletter = await Letter.getLetterById(letter);
    if (theletter.from.toString() !== user.toString()) {
      throw new Error("You are not the author of this letter!");
    }
    return await Letter.unshowLetter(letter);
  }

  @Router.delete("/letter/:_id")
  async deleteLetterServer(_id: ObjectId) {
    return await Letter.deleteLetter_server(_id);
  }

  @Router.delete("/letter/client/:_id")
  async deleteLetterClient(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const theletter = await Letter.getLetterById(_id);
    if (theletter.from.toString() !== user.toString()) {
      throw new Error("You are not the author of this letter!");
    }
    return await Letter.deleteLetter_client(_id);
  }

  // #############Letter Response#####################
  @Router.post("/letterrespond")
  async respondtoLetter(session: WebSessionDoc, originalletter: ObjectId, content: string) {
    const user = WebSession.getUser(session);
    const theresponse = await Letter.respondtoLetter(user, originalletter, content);
    return theresponse;
  }

  @Router.get("/letterrespond")
  async getLetterResponse(originalletter: ObjectId) {
    const theresponse = await Letter.getLetterResponseByLetter(originalletter);
    return theresponse;
  }

  //USE THIS IN ALPHA VERSION??
  @Router.get("/primaryrespond")
  async getPrimaryResponse(originalletter: ObjectId) {
    const theresponse = await Letter.getPrimaryResponse(originalletter);
    return theresponse;
  }

  // ############################################################
  // Contact
  // ############################################################
  @Router.post("/contact")
  async createUserContact(session: WebSessionDoc, contact: ObjectId) {
    const user = WebSession.getUser(session);
    return await Contact.createAppUserContact(user, contact);
  }

  @Router.post("/contact/bound")
  async boundUsertoPatient(session: WebSessionDoc, patientname: string) {
    const user = WebSession.getUser(session);
    const patientuser = await User.getUserByUsername(patientname);
    return await Contact.createAppUserContact(patientuser._id, user, "User");
  }

  @Router.get("/contact")
  async getContacts(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Contact.getContactsbyOwner(user);
  }

  @Router.get("/contact/inapp")
  async getInAppContacts(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Contact.getInAppContactsbyOwner(user);
  }

  @Router.get("/contact/type")
  async checkContactType(session: WebSessionDoc, contact: ObjectId) {
    const user = WebSession.getUser(session);
    return await Contact.checkContactType(user, contact);
  }

  @Router.get("/contact/usernames")
  async getAllContactUsername(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const contacts = await Contact.getContactsbyOwner(user);
    const usernames = [];
    for (const contact of contacts) {
      if (contact.type === "NonUser") {
        const emailuser = await Contact.getEmailContactbyId(contact.contact);
        if (emailuser === null) {
          continue;
        }
        usernames.push(emailuser.username);
        continue;
      } else if (contact.type === "User") {
        try {
          const username = (await User.getUserById(contact.contact)).username;
          usernames.push(username);
        } catch (error) {
          continue;
        }
      }
    }
    return usernames;
  }

  @Router.post("/contact/receiver")
  async getallUseridwithContactName(contactname: string[]) {
    const userids = [];
    for (const name of contactname) {
      try {
        const user = await User.getUserByUsername(name);
        userids.push(user._id);
      } catch (error) {
        const user = await Contact.getEmailContactbyUsername(name);
        if (user === null) {
          continue;
        }
        userids.push(user._id);
      }
    }
    return userids;
  }

  @Router.get("/contact/receiver/:_id")
  async getContactNamebyId(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const contact = (await Contact.getContactsbyContact(user, _id))[0];
    if (contact === null) {
      throw new Error("Contact not found!");
    } else {
      if (contact.type === "User") {
        return (await User.getUserById(_id)).username;
      }
      const emailcontact = await Contact.getEmailContactbyId(_id);
      if (emailcontact === null) {
        throw new Error("Email contact not found!");
      }
      return emailcontact.username;
    }
  }

  @Router.get("/contact/email")
  async getEmailContacts(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Contact.getEmailContactsbyOwner(user);
  }

  @Router.post("/contact/passcode")
  async createPatientPasscode(session: WebSessionDoc, passcode: string) {
    const user = WebSession.getUser(session);
    return await Contact.createPatientPasscode(user, passcode);
  }

  @Router.post("/contact/passcode/verified")
  async verifyPatientPasscode(patientname: string, passcode: string) {
    const patient = await User.getUserByUsername(patientname);
    return await Contact.verifyPatientPasscode(patient._id, passcode);
  }

  // ##################### email #######################################
  @Router.post("/contact/email")
  async createEmailContact(session: WebSessionDoc, username: string, email: string) {
    const user = WebSession.getUser(session);
    return await Contact.createEmailContact(user, username, email);
  }

  @Router.get("/email/:_id")
  async getEmailaddressbyid(_id: ObjectId) {
    return await Contact.getemailaddressbyId(_id);
  }

  @Router.get("/email/:username")
  async getEmailaddressbyusername(username: string) {
    const emailcontact = await Contact.getEmailContactbyUsername(username);
    if (emailcontact === null) {
      throw new Error("Email contact not found!");
    }
    return emailcontact.email;
  }

  @Router.post("/email")
  async sendEmail(user: ObjectId, to: string, content: string) {
    const username = (await User.getUserById(user)).username;
    await Email.send(username, to, content);
    return { msg: "Email sent!" };
  }

  // ############################################################
  // Mood
  // ############################################################
  @Router.post("/moods")
  async createMood(session: WebSessionDoc, mood: string, notify: boolean, viewers?: ObjectId[]) {
    const user = WebSession.getUser(session);
    return await Mood.create(user, mood, notify, viewers);
  }

  @Router.patch("/moods/:_id")
  async updateMood(session: WebSessionDoc, _id: ObjectId, update: Partial<MoodDoc>) {
    const user = WebSession.getUser(session);
    await Mood.isOwner(user);
    return await Mood.update(_id, update);
  }

  @Router.get("/moods/:owner")
  async getMoods(owner?: string) {
    let moods;
    if (owner) {
      const _id = (await User.getUserByUsername(owner))._id;
      moods = await Mood.getByOwner(_id);
    } else {
      moods = await Mood.getMoods({});
    }
    return moods;
  }

  @Router.get("/moods/:owner/previous")
  async getPreviousMoods(owner: string) {
    const _id = (await User.getUserByUsername(owner))._id;
    const previousMoods = await Mood.getPreviousMoods(_id);
    return previousMoods;
  }

  @Router.delete("/moods")
  async deleteMood(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const moodId = await Mood.getByOwnerId(user);
    return Mood.delete(moodId);
  }

  @Router.patch("/moods/:_id/addViewers")
  async addViewer(session: WebSessionDoc, viewer: ObjectId) {
    const user = WebSession.getUser(session);
    return await Mood.addViewer(user, viewer);
  }

  @Router.patch("/moods/:_id/removeViewers")
  async removeViewer(session: WebSessionDoc, viewer: ObjectId) {
    const user = WebSession.getUser(session);
    await Mood.isOwner(user);
    return await Mood.removeViewer(user, viewer);
  }

  //#############################################################
  // Preferences
  //#############################################################
  @Router.get("/preferences")
  async getPreferencesByUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Preference.getUserPreferences(user);
  }

  @Router.patch("/preferences")
  async updatePreferences(session: WebSessionDoc, update: Partial<PreferenceDoc>) {
    const user = WebSession.getUser(session);
    return await Preference.updatePreference(user, update);
  }

  @Router.patch("/preferences/reset")
  async resetDefaultPreferences(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Preference.resetPreferences(user);
  }
}

export default getExpressRouter(new Routes());
