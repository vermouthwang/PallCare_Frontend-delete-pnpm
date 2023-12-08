import { User } from "./app";
import { DiaryDoc } from "./concepts/diary";
import { AlreadyFriendsError, FriendNotFoundError, FriendRequestAlreadyExistsError, FriendRequestDoc, FriendRequestNotFoundError } from "./concepts/friend";
import { PostAuthorNotMatchError, PostDoc } from "./concepts/post";
import { TopicDoc } from "./concepts/topic";
import { WishDoc } from "./concepts/wish";
import { Router } from "./framework/router";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert PostDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async post(post: PostDoc | null) {
    if (!post) {
      return post;
    }
    const author = await User.getUserById(post.author);
    return { ...post, author: author.username };
  }

  /**
   * Same as {@link post} but for an array of PostDoc for improved performance.
   */
  static async posts(posts: PostDoc[]) {
    const authors = await User.idsToUsernames(posts.map((post) => post.author));
    return posts.map((post, i) => ({ ...post, author: authors[i] }));
  }

  /**
   * Convert FriendRequestDoc into more readable format for the frontend
   * by converting the ids into usernames.
   */
  static async friendRequests(requests: FriendRequestDoc[]) {
    const from = requests.map((request) => request.from);
    const to = requests.map((request) => request.to);
    const usernames = await User.idsToUsernames(from.concat(to));
    return requests.map((request, i) => ({ ...request, from: usernames[i], to: usernames[i + requests.length] }));
  }

  /**
   * Convert WishDoc into more readable format for the frontend
   */
  static async wish(wish: WishDoc | null) {
    if (!wish) {
      return wish;
    }
    const author = await User.getUserById(wish.author);
    return { ...wish, author: author.username };
  }

  /**
   * Same as {@link wish} but for an array of WishDoc for improved performance.
   */
  static async wishes(wishes: WishDoc[]) {
    const authors = await User.idsToUsernames(wishes.map((wish) => wish.author));
    return wishes.map((wish, i) => ({ ...wish, author: authors[i] }));
  }

  /**
   * Convert TopicDoc into more readable format for the frontend
   */
  static async topic(topic: TopicDoc | null) {
    if (!topic) {
      return topic;
    }
    const author = await User.getUserById(topic.author);
    return { ...topic, author: author.username };
  }

  /**
   * Same as {@link topic} but for an array of TopicDoc for improved performance.
   */
  static async topics(topics: TopicDoc[]) {
    const authors = await User.idsToUsernames(topics.map((topic) => topic.author));
    return topics.map((topic, i) => ({ ...topic, author: authors[i] }));
  }

  /**
   * Convert DiaryDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async diary(diary: DiaryDoc | null) {
    if (!diary) {
      return diary;
    }
    const author = await User.getUserById(diary.author);
    return { ...diary, author: author.username };
  }

  /**
   * Same as {@link diary} but for an array of DiaryDoc for improved performance.
   */
  static async diaries(diaries: DiaryDoc[]) {
    const authors = await User.idsToUsernames(diaries.map((diary) => diary.author));
    return diaries.map((diary, i) => ({ ...diary, author: authors[i] }));
  }
}

Router.registerError(PostAuthorNotMatchError, async (e) => {
  const username = (await User.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(FriendRequestAlreadyExistsError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.from), User.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.user1), User.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendRequestNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.from), User.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(AlreadyFriendsError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.user1), User.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});
