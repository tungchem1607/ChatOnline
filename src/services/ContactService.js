import UserModel from "../models/userModel";
import ContactModel from "../models/contactModel";
import NotificationModel from "../models/notificationModel";
import _ from "lodash";

const LIMIT_NUMER_TAKEN = 1;
class ContactService {
  findUsersContact(currentUserId, keyword) {
    return new Promise(async (resolve, reject) => {
      let deprecatedUserIds = [currentUserId];
      let contactsByUser = await ContactModel.findAllByUser(currentUserId);
      contactsByUser.forEach((contact) => {
        deprecatedUserIds.push(contact.userId);
        deprecatedUserIds.push(contact.contactId);
      });

      deprecatedUserIds = _.uniqBy(deprecatedUserIds);
      let users = await UserModel.findAllForAddContact(
        deprecatedUserIds,
        keyword
      );
      resolve(users);
    });
  }

  addNew(currentUserId, contactId) {
    return new Promise(async (resolve, reject) => {
      let contactExists = await ContactModel.checkExists(
        currentUserId,
        contactId
      );
      if (contactExists) {
        return reject(false);
      }
      // create contact
      let newContactItem = {
        userId: currentUserId,
        contactId: contactId,
      };
      let newContact = await ContactModel.createNew(newContactItem);

      // create notification
      let notificationItem = {
        senderId: currentUserId,
        receiverId: contactId,
        type: NotificationModel.types.ADD_CONTACT,
      };
      await NotificationModel.model.createNew(notificationItem);
      resolve(newContact);
    });
  }
  removeContact(currentUserId, contactId){
    return new Promise(async (resolve, reject) => {
      let removeContact = await ContactModel.removeContact(currentUserId, contactId);
      if (removeContact.n === 0) {
        return reject(false);
      }
      resolve(true);
    });
  }

  removeRequestContactSent(currentUserId, contactId) {
    return new Promise(async (resolve, reject) => {
      let removeReq = await ContactModel.removeRequestContactSent(
        currentUserId,
        contactId
      );
      if (removeReq.n === 0) {
        return reject(false);
      }
      //remove notification
      await NotificationModel.model.removeRequestContactSentNotification(
        currentUserId,
        contactId,
        NotificationModel.types.ADD_CONTACT
      );
      resolve(true);
    });
  }
  removeRequestContactReceived(currentUserId, contactId) {
    return new Promise(async (resolve, reject) => {
      let removeReq = await ContactModel.removeRequestContactReceived(
        currentUserId,
        contactId
      );
      if (removeReq.n === 0) {
        return reject(false);
      }
      //remove notification chức năng này chưa muốn làm
      // await NotificationModel.model.removeRequestContactSentNotification(
      //   currentUserId,
      //   contactId,
      //   NotificationModel.types.ADD_CONTACT
      // );
      resolve(true);
    });
  }

  approveRequestContactReceived(currentUserId, contactId) {
    return new Promise(async (resolve, reject) => {
      let approveReq = await ContactModel.approveRequestContactReceived(
        currentUserId,
        contactId
      );
      if (approveReq.nModified === 0) {
        return reject(false);
      }
      // create notification
      let notificationItem = {
        senderId: currentUserId,
        receiverId: contactId,
        type: NotificationModel.types.APPROVE_CONTACT,
      };
      await NotificationModel.model.createNew(notificationItem);
      resolve(true);
    });
  }

  getContacts(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        let contacts = await ContactModel.getContacts(
          currentUserId,
          LIMIT_NUMER_TAKEN
        );
        let users = contacts.map(async (contact) => {
          if (contact.contactId == currentUserId) {
            return await UserModel.getNormalUserDataById(contact.userId);
          } else {
            return await UserModel.getNormalUserDataById(contact.contactId);
          }
        });

        resolve(await Promise.all(users));
      } catch (error) {
        reject(error);
      }
    });
  }
  getContactSent(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        let contacts = await ContactModel.getContactSent(
          currentUserId,
          LIMIT_NUMER_TAKEN
        );
        let users = contacts.map(async (contact) => {
          return await UserModel.getNormalUserDataById(contact.contactId);
        });

        resolve(await Promise.all(users));
      } catch (error) {
        reject(error);
      }
    });
  }
  getContactReceived(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        let contacts = await ContactModel.getContactReceived(
          currentUserId,
          LIMIT_NUMER_TAKEN
        );
        let users = contacts.map(async (contact) => {
          return await UserModel.getNormalUserDataById(contact.userId);
        });

        resolve(await Promise.all(users));
      } catch (error) {
        reject(error);
      }
    });
  }

  countAllContacts(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        let count = await ContactModel.countAllContacts(currentUserId);
        resolve(count);
      } catch (error) {
        reject(error);
      }
    });
  }

  countAllContactsSent(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        let count = await ContactModel.countAllContactsSent(currentUserId);
        resolve(count);
      } catch (error) {
        reject(error);
      }
    });
  }

  countAllContactsReceived(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        let count = await ContactModel.countAllContactsReceived(currentUserId);
        resolve(count);
      } catch (error) {
        reject(error);
      }
    });
  };

  readMoreContacts(currentUserId,skipNumberContacts){
    return new Promise(async (resolve, reject) => {
      try {
        let newContacts = await ContactModel.readMoreContacts(currentUserId, skipNumberContacts, LIMIT_NUMER_TAKEN);
        let users = newContacts.map(async (contact) => {
          if (contact.contactId == currentUserId) {
            return await UserModel.getNormalUserDataById(contact.userId);
          } else {
            return await UserModel.getNormalUserDataById(contact.contactId);
          }
        });

        resolve(await Promise.all(users));
      } catch (error) {
        reject(error);
      }
    })
  };
  readMoreContactsSent(currentUserId,skipNumberContacts){
    return new Promise(async (resolve, reject) => {
      try {
        let newContacts = await ContactModel.readMoreContactsSent(currentUserId, skipNumberContacts, LIMIT_NUMER_TAKEN);
        let users = newContacts.map(async (contact) => {
          return await UserModel.getNormalUserDataById(contact.contactId);
        });

        resolve(await Promise.all(users));
      } catch (error) {
        reject(error);
      }
    })
  }

  readMoreContactsReceived(currentUserId,skipNumberContacts){
    return new Promise(async (resolve, reject) => {
      try {
        let newContacts = await ContactModel.readMoreContactsReceived(currentUserId, skipNumberContacts, LIMIT_NUMER_TAKEN);
        let users = newContacts.map(async (contact) => {
          return await UserModel.getNormalUserDataById(contact.userId);
        });

        resolve(await Promise.all(users));
      } catch (error) {
        reject(error);
      }
    })
  }

}

module.exports = new ContactService();
