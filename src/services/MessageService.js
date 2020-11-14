import ContactModel from "../models/contactModel";
import UserModel from "../models/userModel";
import ChatGroupModel from "../models/chatGroupModel";
import MessageModel from "../models/messageModel";
import _ from "lodash";

const LIMIT_CONVERSATIONS_TAKEN = 15
const LIMIT_MESSAGES_TAKEN = 30

class MessageService {
  getAllConversationItems(currentUserId){
    return new Promise(async (resolve, reject) =>{
      try {
        let contacts = await ContactModel.getContacts(
          currentUserId,
          LIMIT_CONVERSATIONS_TAKEN
        );
        let userConversationsPromise = contacts.map(async (contact) => {
          if (contact.contactId == currentUserId) {
            let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
            getUserContact.updatedAt = contact.updatedAt;
            return getUserContact;
          } else {
            let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
            getUserContact.updatedAt = contact.updatedAt;
            return getUserContact;
          }
        });
        let userConversations = await Promise.all(userConversationsPromise);
        let groupConversations = await ChatGroupModel.getChatGroup(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
        let allConversations = userConversations.concat(groupConversations);
        allConversations = _.sortBy(allConversations,(item)=>{
          return -item.updatedAt;
        })
        
        // get messages to apply in screen chat 
        let allConversationsWithMessagesPromise = allConversations.map(async (conversation) =>{
          let getMessages = await MessageModel.model.getMessages(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
          conversation = conversation.toObject();
          conversation.messages = getMessages ;
          return conversation;
        });
        let allConversationsWithMessages = await Promise.all(allConversationsWithMessagesPromise);
        // let sort by updatedAt desending
        allConversationsWithMessages = _.sortBy(allConversationsWithMessages,(item)=>{
          return -item.updatedAt;
        });
        resolve({
          allConversationsWithMessages: allConversationsWithMessages
        });
      } catch (error) {
        reject(error);
      }
    })
  }
}

module.exports = new MessageService