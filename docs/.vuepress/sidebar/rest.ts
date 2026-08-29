/** Complete English REST API and Webhooks sidebar. Menu labels are independent of Markdown H1 titles. */
export const REST_SIDEBAR = [
  {
    "text": "Server API Overview",
    "link": "/rest/overview.html",
    "only": [
      "server-side"
    ]
  },
  {
    "text": "RESTful API Call Frequency Limits",
    "link": "/rest/limitationapi.html",
    "only": [
      "server-side"
    ]
  },
  {
    "type": "separator",
    "only": [
      "server-side"
    ]
  },
  {
    "text": "Token Authentication",
    "collapsible": true,
    "children": [
      {
        "text": "Authenticate with an App Token",
        "link": "/rest/easemob_app_token.html"
      },
      {
        "text": "Authenticate with a User Token",
        "link": "/rest/easemob_user_token.html"
      }
    ],
    "only": [
      "server-side"
    ]
  },
  {
    "text": "Message Management",
    "collapsible": true,
    "children": [
      {
        "text": "Send One-to-One Messages",
        "link": "/rest/message_single.html"
      },
      {
        "text": "Send Group Messages",
        "link": "/rest/message_group.html"
      },
      {
        "text": "Send Chat Room Messages",
        "link": "/rest/message_chatroom.html"
      },
      {
        "text": "Send Streaming Messages",
        "collapsible": true,
        "children": [
          {
            "text": "Send One-to-One Stream Messages",
            "link": "/rest/message_stream_send_single.html"
          },
          {
            "text": "Send Group Stream Messages",
            "link": "/rest/message_stream_send_group.html"
          }
        ]
      },
      {
        "text": "Send Global Broadcast Messages",
        "collapsible": true,
        "children": [
          {
            "text": "Send a Broadcast Message to All App Users",
            "link": "/rest/broadcast_to_all_users.html"
          },
          {
            "text": "Send a Broadcast Message to Online App Users",
            "link": "/rest/broadcast_to_online_users.html"
          },
          {
            "text": "Send a Global Broadcast Message to Chat Rooms",
            "link": "/rest/broadcast_to_chatrooms.html"
          }
        ]
      },
      {
        "text": "Upload and Download Files",
        "collapsible": true,
        "children": [
          {
            "text": "Upload a File",
            "link": "/rest/message_upload_file.html"
          },
          {
            "text": "Download a File",
            "link": "/rest/message_download_file.html"
          },
          {
            "text": "Download a File Thumbnail",
            "link": "/rest/message_download_thumbnail.html"
          }
        ]
      },
      {
        "text": "Retrieve Historical Messages",
        "link": "/rest/message_historical.html"
      },
      {
        "text": "Set the Storage Method for Specified Message Attachments",
        "link": "/rest/message_attachment_storage.html"
      },
      {
        "text": "Message Reactions",
        "collapsible": true,
        "children": [
          {
            "text": "Add a Reaction",
            "link": "/rest/reaction_add.html"
          },
          {
            "text": "Delete a Reaction",
            "link": "/rest/reaction_delete.html"
          },
          {
            "text": "Retrieve Reactions by Message ID",
            "link": "/rest/reaction_get_by_msg_id.html"
          },
          {
            "text": "Retrieve Reaction Information by Message ID and Emoji ID",
            "link": "/rest/reaction_get_by_msg_id_emoji_id.html"
          }
        ]
      },
      {
        "text": "Recall Messages",
        "collapsible": true,
        "children": [
          {
            "text": "Recall a Message",
            "link": "/rest/message_recall_single.html"
          },
          {
            "text": "Recall Messages in Batches",
            "link": "/rest/message_recall_batch.html"
          }
        ]
      },
      {
        "text": "Delete a Conversation for One User",
        "link": "/rest/conversation_delete.html"
      },
      {
        "text": "Delete Roaming Messages",
        "collapsible": true,
        "children": [
          {
            "text": "Delete One-to-One Chat Roaming Messages for One User by Message ID",
            "link": "/rest/message_delete_roam_single_msgid.html"
          },
          {
            "text": "Delete Group and Chat Room Roaming Messages for One User by Message ID",
            "link": "/rest/message_delete_roam_group_room_msgid.html"
          },
          {
            "text": "Delete All Roaming Messages for One User",
            "link": "/rest/message_delete_roam_user.html"
          },
          {
            "text": "Delete One-to-One Chat Roaming Messages up to a Specific Time for One User",
            "link": "/rest/message_delete_roam_single_time.html"
          },
          {
            "text": "Delete Group or Chat Room Roaming Messages up to a Specific Time for One User",
            "link": "/rest/message_delete_roam_group_room_time.html"
          }
        ]
      },
      {
        "text": "Edit a Message",
        "link": "/rest/message_modify.html"
      },
      {
        "text": "Retrieve Offline Message Data",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve a User's Offline Message Count",
            "link": "/rest/offline_msg_count_get.html"
          },
          {
            "text": "Retrieve the Delivery Status of an Offline Message",
            "link": "/rest/offline_msg_status_get.html"
          }
        ]
      },
      {
        "text": "Import Messages",
        "collapsible": true,
        "children": [
          {
            "text": "Import One-to-One Chat Messages",
            "link": "/rest/message_import_single.html"
          },
          {
            "text": "Import Group Chat Messages",
            "link": "/rest/message_import_group.html"
          }
        ]
      }
    ],
    "only": [
      "server-side"
    ]
  },
  {
    "text": "Chat Group Management",
    "collapsible": true,
    "children": [
      {
        "text": "Create a Chat Group",
        "link": "/rest/group_create.html"
      },
      {
        "text": "Retrieve Chat Groups",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve Chat Groups in an App",
            "link": "/rest/group_obtain_total.html"
          },
          {
            "text": "Retrieve the Chat Groups a User Has Joined",
            "link": "/rest/group_obtain_joined.html"
          },
          {
            "text": "Retrieve Chat Group Details",
            "link": "/rest/group_obtain_detail.html"
          }
        ]
      },
      {
        "text": "Manage Chat Groups",
        "collapsible": true,
        "children": [
          {
            "text": "Modify Chat Group Information",
            "link": "/rest/group_modify.html"
          },
          {
            "text": "Ban a Chat Group",
            "link": "/rest/group_ban.html"
          },
          {
            "text": "Unban a Chat Group",
            "link": "/rest/group_unban.html"
          },
          {
            "text": "Destroy a Chat Group",
            "link": "/rest/group_delete.html"
          }
        ]
      },
      {
        "text": "Manage Chat Group Announcements",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve the Chat Group Announcement",
            "link": "/rest/group_announcement_obtain.html"
          },
          {
            "text": "Modify the Chat Group Announcement",
            "link": "/rest/group_announcement_modify.html"
          }
        ]
      },
      {
        "text": "Manage Chat Group Shared Files",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve Chat Group Shared Files",
            "link": "/rest/group_shared_file_obtain.html"
          },
          {
            "text": "Upload a Chat Group Shared File",
            "link": "/rest/group_shared_file_upload.html"
          },
          {
            "text": "Download a Chat Group Shared File",
            "link": "/rest/group_shared_file_download.html"
          },
          {
            "text": "Delete a Chat Group Shared File",
            "link": "/rest/group_shared_file_delete.html"
          }
        ]
      },
      {
        "text": "Add Chat Group Members",
        "collapsible": true,
        "children": [
          {
            "text": "Add a Chat Group Member",
            "link": "/rest/group_member_add_single.html"
          },
          {
            "text": "Add Chat Group Members in Batches",
            "link": "/rest/group_members_add_batch.html"
          }
        ]
      },
      {
        "text": "Remove Chat Group Members",
        "collapsible": true,
        "children": [
          {
            "text": "Remove a Chat Group Member",
            "link": "/rest/group_member_remove_single.html"
          },
          {
            "text": "Remove Chat Group Members in Batches",
            "link": "/rest/group_members_remove_batch.html"
          }
        ]
      },
      {
        "text": "Manage Chat Group Members",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve Chat Group Members by Page",
            "link": "/rest/group_member_list_obtain.html"
          },
          {
            "text": "Manage Chat Group Owners and Admins",
            "collapsible": true,
            "children": [
              {
                "text": "Transfer Chat Group Ownership",
                "link": "/rest/group_owner_transfer.html"
              },
              {
                "text": "Add a Chat Group Admin",
                "link": "/rest/group_admin_add.html"
              },
              {
                "text": "Retrieve the Chat Group Admin List",
                "link": "/rest/group_admin_list_get.html"
              },
              {
                "text": "Remove a Chat Group Admin",
                "link": "/rest/group_admin_remove.html"
              }
            ]
          },
          {
            "text": "Manage Mutes",
            "collapsible": true,
            "children": [
              {
                "text": "Mute Specified Chat Group Members",
                "link": "/rest/group_member_mute.html"
              },
              {
                "text": "Mute All Chat Group Members",
                "link": "/rest/group_member_mute_all.html"
              },
              {
                "text": "Unmute Chat Group Members",
                "link": "/rest/group_member_unmute.html"
              },
              {
                "text": "Unmute All Chat Group Members",
                "link": "/rest/group_member_unmute_all.html"
              },
              {
                "text": "Retrieve the Chat Group Mute List",
                "link": "/rest/group_member_mutelist_obtain.html"
              }
            ]
          },
          {
            "text": "Manage Allowlists",
            "collapsible": true,
            "children": [
              {
                "text": "Add a User to the Chat Group Allowlist",
                "link": "/rest/group_allowlist_add_single.html"
              },
              {
                "text": "Add Users to the Chat Group Allowlist in Batches",
                "link": "/rest/group_allowlist_add_batch.html"
              },
              {
                "text": "Remove Users from the Chat Group Allowlist",
                "link": "/rest/group_allowlist_remove.html"
              },
              {
                "text": "Retrieve the Chat Group Allowlist",
                "link": "/rest/group_allowlist_query.html"
              }
            ]
          },
          {
            "text": "Manage Blocklists",
            "collapsible": true,
            "children": [
              {
                "text": "Add a User to the Group Blocklist",
                "link": "/rest/group_member_blocklist_add_single.html"
              },
              {
                "text": "Add Users to the Group Blocklist in Batches",
                "link": "/rest/group_member_blocklist_add_batch.html"
              },
              {
                "text": "Remove a User from the Group Blocklist",
                "link": "/rest/group_member_blocklist_remove_single.html"
              },
              {
                "text": "Remove Users from the Group Blocklist in Batches",
                "link": "/rest/group_member_blocklist_remove_batch.html"
              },
              {
                "text": "Retrieve the Group Blocklist",
                "link": "/rest/group_member_blocklist_obtain.html"
              }
            ]
          },
          {
            "text": "Check Whether a User Has Joined a Chat Group",
            "link": "/rest/group_check_joined.html"
          },
          {
            "text": "Manage Custom Chat Group Member Attributes",
            "collapsible": true,
            "children": [
              {
                "text": "Set Custom Attributes of a Chat Group Member",
                "link": "/rest/group_member_attribute_set.html"
              },
              {
                "text": "Set Custom Attributes of Chat Group Members in Batches",
                "link": "/rest/group_member_attribute_set_batch.html"
              },
              {
                "text": "Retrieve All Custom Attributes of a Chat Group Member",
                "link": "/rest/group_member_attribute_get.html"
              },
              {
                "text": "Retrieve Custom Attributes of Chat Group Members by Attribute Key",
                "link": "/rest/group_member_attribute_get_by_key.html"
              }
            ]
          }
        ]
      },
      {
        "text": "Manage Message Threads",
        "collapsible": true,
        "children": [
          {
            "text": "Create a Message Thread",
            "link": "/rest/group_thread_create.html"
          },
          {
            "text": "Modify a Message Thread",
            "link": "/rest/group_thread_modify.html"
          },
          {
            "text": "Delete a Message Thread",
            "link": "/rest/group_thread_delete.html"
          },
          {
            "text": "Retrieve Message Threads in an App",
            "link": "/rest/group_thread_obtain.html"
          },
          {
            "text": "Retrieve the Message Threads a User Has Joined",
            "link": "/rest/group_thread_joined.html"
          },
          {
            "text": "Retrieve the Message Threads a User Has Joined in a Chat Group",
            "link": "/rest/group_threads_in_group.html"
          },
          {
            "text": "Retrieve the Message Thread Member List",
            "link": "/rest/group_thread_member_get.html"
          },
          {
            "text": "Add Users to a Message Thread in Batches",
            "link": "/rest/group_thread_member_add.html"
          },
          {
            "text": "Remove Message Thread Members in Batches",
            "link": "/rest/group_thread_member_remove.html"
          }
        ]
      }
    ],
    "only": [
      "server-side"
    ]
  },
  {
    "text": "Chat Room Management",
    "collapsible": true,
    "children": [
      {
        "text": "Manage Superadmins",
        "collapsible": true,
        "children": [
          {
            "text": "Add a Chat Room Superadmin",
            "link": "/rest/chatroom_superadmin_add.html"
          },
          {
            "text": "Retrieve the Chat Room Superadmin List by Page",
            "link": "/rest/chatroom_superadmin_list_obtain.html"
          },
          {
            "text": "Remove a Chat Room Superadmin",
            "link": "/rest/chatroom_superadmin_delete.html"
          }
        ]
      },
      {
        "text": "Create a Chat Room",
        "link": "/rest/chatroom_create.html"
      },
      {
        "text": "Retrieve Chat Rooms",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve Chat Rooms in an App",
            "link": "/rest/chatroom_obtain_total.html"
          },
          {
            "text": "Retrieve Chat Rooms Joined by a User",
            "link": "/rest/chatroom_obtain_joined.html"
          },
          {
            "text": "Retrieve Chat Room Details",
            "link": "/rest/chatroom_obtain_detail.html"
          }
        ]
      },
      {
        "text": "Manage Chat Rooms",
        "collapsible": true,
        "children": [
          {
            "text": "Modify Chat Room Information",
            "link": "/rest/chatroom_modify.html"
          },
          {
            "text": "Destroy a Chat Room",
            "link": "/rest/chatroom_delete.html"
          }
        ]
      },
      {
        "text": "Manage Chat Room Attributes",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve the Chat Room Announcement",
            "link": "/rest/chatroom_announcement_get.html"
          },
          {
            "text": "Modify the Chat Room Announcement",
            "link": "/rest/chatroom_announcement_update.html"
          },
          {
            "text": "Set Chat Room Custom Attributes",
            "link": "/rest/chatroom_custom_attribute_set.html"
          },
          {
            "text": "Force Set Chat Room Custom Attributes",
            "link": "/rest/chatroom_custom_attribute_set_force.html"
          },
          {
            "text": "Retrieve Chat Room Custom Attributes",
            "link": "/rest/chatroom_custom_attribute_get.html"
          },
          {
            "text": "Delete Chat Room Custom Attributes",
            "link": "/rest/chatroom_custom_attribute_delete.html"
          },
          {
            "text": "Force Delete Chat Room Custom Attributes",
            "link": "/rest/chatroom_custom_attribute_delete_force.html"
          }
        ]
      },
      {
        "text": "Add Chat Room Members",
        "collapsible": true,
        "children": [
          {
            "text": "Add a Chat Room Member",
            "link": "/rest/chatroom_member_add_single.html"
          },
          {
            "text": "Add Chat Room Members in Batches",
            "link": "/rest/chatroom_member_add_batch.html"
          }
        ]
      },
      {
        "text": "Remove Chat Room Members",
        "collapsible": true,
        "children": [
          {
            "text": "Remove a Chat Room Member",
            "link": "/rest/chatroom_member_remove_single.html"
          },
          {
            "text": "Remove Chat Room Members in Batches",
            "link": "/rest/chatroom_member_remove_batch.html"
          }
        ]
      },
      {
        "text": "Manage Chat Room Members",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve the Chat Room Member List",
            "link": "/rest/chatroom_member_list_obtain.html"
          },
          {
            "text": "Manage Chat Room Owners and Admins",
            "collapsible": true,
            "children": [
              {
                "text": "Transfer Chat Room Ownership",
                "link": "/rest/chatroom_owner_transfer.html"
              },
              {
                "text": "Add a Chat Room Admin",
                "link": "/rest/chatroom_admin_add.html"
              },
              {
                "text": "Retrieve the Chat Room Admin List",
                "link": "/rest/chatroom_admin_list_get.html"
              },
              {
                "text": "Remove a Chat Room Admin",
                "link": "/rest/chatroom_admin_remove.html"
              }
            ]
          },
          {
            "text": "Manage Mutes",
            "collapsible": true,
            "children": [
              {
                "text": "Mute Chat Room Members",
                "link": "/rest/chatroom_member_mute.html"
              },
              {
                "text": "Mute All Chat Room Members",
                "link": "/rest/chatroom_member_mute_all.html"
              },
              {
                "text": "Unmute Chat Room Members",
                "link": "/rest/chatroom_member_unmute.html"
              },
              {
                "text": "Unmute All Chat Room Members",
                "link": "/rest/chatroom_member_unmute_all.html"
              },
              {
                "text": "Retrieve the Chat Room Mute List",
                "link": "/rest/chatroom_member_mutelist_obtain.html"
              },
              {
                "text": "Mute Users by Chat Room Tag",
                "link": "/rest/chatroom_user_tag_mute.html"
              },
              {
                "text": "Set a User's Chat Room Tags",
                "link": "/rest/chatroom_user_tag_set.html"
              },
              {
                "text": "Retrieve a User's Chat Room Tags",
                "link": "/rest/chatroom_user_tag_get.html"
              }
            ]
          },
          {
            "text": "Manage Allowlists",
            "collapsible": true,
            "children": [
              {
                "text": "Chat Room Allowlist Management",
                "link": "/rest/chatroom_allowlist_overview.html"
              },
              {
                "text": "Add a User to the Chat Room Allowlist",
                "link": "/rest/chatroom_allowlist_add_single.html"
              },
              {
                "text": "Add Users to the Chat Room Allowlist in Batches",
                "link": "/rest/chatroom_allowlist_add_batch.html"
              },
              {
                "text": "Remove Users from the Chat Room Allowlist",
                "link": "/rest/chatroom_allowlist_remove.html"
              },
              {
                "text": "Retrieve the Chat Room Allowlist",
                "link": "/rest/chatroom_allowlist_obtain.html"
              }
            ]
          },
          {
            "text": "Manage Blocklists",
            "collapsible": true,
            "children": [
              {
                "text": "Add a User to the Chat Room Blocklist",
                "link": "/rest/chatroom_member_blocklist_add_single.html"
              },
              {
                "text": "Add Users to the Chat Room Blocklist in Batches",
                "link": "/rest/chatroom_member_blocklist_add_batch.html"
              },
              {
                "text": "Remove a User from the Chat Room Blocklist",
                "link": "/rest/chatroom_member_blocklist_remove_single.html"
              },
              {
                "text": "Remove Users from the Chat Room Blocklist in Batches",
                "link": "/rest/chatroom_member_blocklist_remove_batch.html"
              },
              {
                "text": "Retrieve the Chat Room Blocklist",
                "link": "/rest/chatroom_member_blocklist_obtain.html"
              }
            ]
          }
        ]
      }
    ],
    "only": [
      "server-side"
    ]
  },
  {
    "text": "User Management",
    "collapsible": true,
    "children": [
      {
        "text": "User Account Management",
        "collapsible": true,
        "children": [
          {
            "text": "Register Users",
            "collapsible": true,
            "children": [
              {
                "text": "Register a User Without Authorization",
                "link": "/rest/account_register_open.html"
              },
              {
                "text": "Register a User with Authorization",
                "link": "/rest/account_register_authorized_single.html"
              },
              {
                "text": "Register Users in Batches with Authorization",
                "link": "/rest/account_register_authorized_batch.html"
              }
            ]
          },
          {
            "text": "Change a User's Password",
            "link": "/rest/account_password_change.html"
          },
          {
            "text": "Retrieve User Details",
            "collapsible": true,
            "children": [
              {
                "text": "Retrieve User Details",
                "link": "/rest/account_detail_obtain_single.html"
              },
              {
                "text": "Retrieve User Details in Batches",
                "link": "/rest/account_detail_obtain_batch.html"
              }
            ]
          },
          {
            "text": "Delete Users",
            "collapsible": true,
            "children": [
              {
                "text": "Delete a User",
                "link": "/rest/account_delete_single.html"
              },
              {
                "text": "Delete Users in Batches",
                "link": "/rest/account_delete_batch.html"
              }
            ]
          },
          {
            "text": "Ban a User",
            "link": "/rest/account_ban.html"
          },
          {
            "text": "Unban a User",
            "link": "/rest/account_unban.html"
          },
          {
            "text": "Force a User Offline",
            "link": "/rest/account_offline_forced.html"
          },
          {
            "text": "Force a User Offline on a Specific Device",
            "link": "/rest/account_offline_device_single.html"
          },
          {
            "text": "Retrieve User Presence",
            "collapsible": true,
            "children": [
              {
                "text": "Retrieve a User's Presence",
                "link": "/rest/account_presence_obtain_single.html"
              },
              {
                "text": "Retrieve User Presence in Batches",
                "link": "/rest/account_presence_obtain_batch.html"
              }
            ]
          },
          {
            "text": "Retrieve the Online Login Device List for an Account",
            "link": "/rest/account_online_device_obtain.html"
          }
        ]
      },
      {
        "text": "User Attributes",
        "collapsible": true,
        "children": [
          {
            "text": "Set User Attributes",
            "link": "/rest/user_attribute_set.html"
          },
          {
            "text": "Delete User Attributes",
            "link": "/rest/user_attribute_delete.html"
          },
          {
            "text": "Get User Attributes",
            "link": "/rest/user_attribute_obtain_single.html"
          },
          {
            "text": "Get User Attributes in Batches",
            "link": "/rest/user_attribute_obtain_batch.html"
          },
          {
            "text": "Get the Total User Attribute Size for an App",
            "link": "/rest/user_attribute_capacity_get.html"
          }
        ]
      },
      {
        "text": "Presence Subscriptions",
        "collapsible": true,
        "children": [
          {
            "text": "Set a User's Presence",
            "link": "/rest/presence_set.html"
          },
          {
            "text": "Subscribe to Presence in Batches",
            "link": "/rest/presence_subscribe.html"
          },
          {
            "text": "Unsubscribe from Users' Presence in Batches",
            "link": "/rest/presence_unsubscribe.html"
          },
          {
            "text": "Retrieve the Subscription List",
            "link": "/rest/presence_subscription_list_obtain.html"
          },
          {
            "text": "Retrieve Presence in Batches",
            "link": "/rest/presence_get.html"
          },
          {
            "text": "Retrieve the Number of Online Members in a Chat Group",
            "link": "/rest/presence_group_online_count_obtain.html"
          }
        ]
      },
      {
        "text": "User Relationships",
        "collapsible": true,
        "children": [
          {
            "text": "Add a Friend",
            "link": "/rest/user_friend_add.html"
          },
          {
            "text": "Check Friends",
            "link": "/rest/user_friend_check.html"
          },
          {
            "text": "Remove a Friend",
            "link": "/rest/user_friend_remove.html"
          },
          {
            "text": "Remove All Friends of a User",
            "link": "/rest/user_friend_remove_all.html"
          },
          {
            "text": "Set Friend Remarks",
            "link": "/rest/user_friend_remark_set.html"
          },
          {
            "text": "Retrieve the Friend List by Page",
            "link": "/rest/user_friend_list_paged.html"
          },
          {
            "text": "Retrieve the Friend List",
            "link": "/rest/user_friend_list_obtain.html"
          },
          {
            "text": "Import a Friend List",
            "link": "/rest/user_friend_import.html"
          },
          {
            "text": "Add Users to the Blocklist",
            "link": "/rest/user_friend_blocklist_add.html"
          },
          {
            "text": "Remove Users from the Blocklist",
            "link": "/rest/user_friend_blocklist_remove.html"
          },
          {
            "text": "Retrieve the Blocklist",
            "link": "/rest/user_friend_blocklist_obtain.html"
          },
          {
            "text": "Check the Blocklist",
            "link": "/rest/user_friend_blocklist_check.html"
          }
        ]
      },
      {
        "text": "Global User Mutes",
        "collapsible": true,
        "children": [
          {
            "text": "Global User Mute",
            "link": "/rest/user_global_mute_overview.html"
          },
          {
            "text": "Set Global Mute for a User",
            "link": "/rest/user_global_mute_set.html"
          },
          {
            "text": "Query the Global Mute Settings of a User",
            "link": "/rest/user_global_mute_query_single.html"
          },
          {
            "text": "Query All Globally Muted Users in an App",
            "link": "/rest/user_global_mute_query_all.html"
          }
        ]
      },
      {
        "text": "User Favorites",
        "collapsible": true,
        "children": [
          {
            "text": "Add a Favorite",
            "link": "/rest/user_collection_add_single.html"
          },
          {
            "text": "Add User Favorites in Batches",
            "link": "/rest/user_collection_add_batch.html"
          },
          {
            "text": "Modify the Extension Information of a User Favorite",
            "link": "/rest/user_collection_ext_modify.html"
          },
          {
            "text": "Delete User Favorites",
            "link": "/rest/user_collection_delete.html"
          },
          {
            "text": "Get User Favorites by Page",
            "link": "/rest/user_collection_get.html"
          }
        ]
      }
    ],
    "only": [
      "server-side"
    ]
  },
  {
    "text": "Offline Push",
    "collapsible": true,
    "children": [
      {
        "text": "Configure Offline Push",
        "collapsible": true,
        "children": [
          {
            "text": "Bind and Unbind Push Information",
            "link": "/rest/push_information_bind_unbind.html"
          },
          {
            "text": "Retrieve Push Binding Information",
            "link": "/rest/push_information_bind_query.html"
          },
          {
            "text": "Set the Nickname Displayed in Offline Push Notifications",
            "link": "/rest/push_nickname_set_single.html"
          },
          {
            "text": "Set Offline Push Nicknames in Batches",
            "link": "/rest/push_nickname_set_batch.html"
          },
          {
            "text": "Set the Offline Push Notification Display Mode",
            "link": "/rest/push_display_mode_set.html"
          },
          {
            "text": "Configure Offline Push",
            "link": "/rest/push_settings_set.html"
          },
          {
            "text": "Retrieve Offline Push Settings",
            "link": "/rest/push_settings_query.html"
          },
          {
            "text": "Use Push Templates",
            "collapsible": true,
            "children": [
              {
                "text": "Use Push Templates",
                "link": "/rest/push_template_overview.html"
              },
              {
                "text": "Create an Offline Push Template",
                "link": "/rest/push_template_create.html"
              },
              {
                "text": "Delete an Offline Push Template",
                "link": "/rest/push_template_delete.html"
              },
              {
                "text": "Query an Offline Push Template",
                "link": "/rest/push_template_query.html"
              },
              {
                "text": "Configure a Push Template When Sending Messages",
                "link": "/rest/push_template_send_message.html"
              },
              {
                "text": "Set the Push Template Name for a Receiver",
                "link": "/rest/push_template_receiver.html"
              }
            ]
          },
          {
            "text": "Common Push Error Codes",
            "link": "/rest/push_error.html"
          }
        ]
      },
      {
        "text": "Message Extensions for Offline Push",
        "link": "/rest/push_extension.html"
      },
      {
        "text": "Retrieve Offline Push Result Statistics",
        "link": "/rest/push_result_statistics.html"
      }
    ],
    "only": [
      "server-side"
    ]
  },
  {
    "text": "Common Error Codes",
    "link": "/rest/error.html",
    "only": [
      "server-side"
    ]
  },
  {
    "text": "Webhooks",
    "collapsible": true,
    "children": [
      {
        "text": "Webhooks Overview",
        "link": "/rest/callback_overview.html"
      },
      {
        "text": "Pre-Delivery Webhook",
        "link": "/rest/callback_presending.html"
      },
      {
        "text": "Post-Delivery Webhook",
        "link": "/rest/callback_postsending.html"
      },
      {
        "text": "Webhook Events",
        "collapsible": true,
        "children": [
          {
            "text": "User Status Change Webhook Events",
            "link": "/rest/callback_login_logout.html"
          },
          {
            "text": "Friend and Blocklist Webhook Events",
            "link": "/rest/callback_contact.html"
          },
          {
            "text": "Message Webhooks",
            "collapsible": true,
            "children": [
              {
                "text": "Message Sending Webhook Events",
                "link": "/rest/callback_message_send.html"
              },
              {
                "text": "One-to-One Message Read Receipt Webhook Events",
                "link": "/rest/callback_single_read_ack.html"
              },
              {
                "text": "Group Message Read Receipt Webhook Events",
                "link": "/rest/callback_group_read_ack.html"
              },
              {
                "text": "Message Editing Webhook Events",
                "link": "/rest/callback_message_modify.html"
              },
              {
                "text": "Message Recall Webhook Events",
                "link": "/rest/callback_message_recall.html"
              },
              {
                "text": "Reaction Webhook Events",
                "link": "/rest/callback_reaction.html"
              }
            ]
          },
          {
            "text": "Chat Group and Chat Room Webhooks",
            "collapsible": true,
            "children": [
              {
                "text": "Creation and Deletion",
                "collapsible": true,
                "children": [
                  {
                    "text": "Chat Group and Chat Room Creation Webhook Events",
                    "link": "/rest/callback_group_room_create.html"
                  },
                  {
                    "text": "Chat Group and Chat Room Deletion Webhook Events",
                    "link": "/rest/callback_group_room_delete.html"
                  }
                ]
              },
              {
                "text": "Information and Status Changes",
                "collapsible": true,
                "children": [
                  {
                    "text": "Chat Group and Chat Room Information Update Webhook Events",
                    "link": "/rest/callback_group_room_info.html"
                  },
                  {
                    "text": "Chat Group and Chat Room Owner Change Webhook Events",
                    "link": "/rest/callback_group_room_owner.html"
                  },
                  {
                    "text": "Chat Group and Chat Room Announcement Webhook Events",
                    "link": "/rest/callback_group_room_announcement.html"
                  },
                  {
                    "text": "Chat Group Ban Status Change Webhook Events",
                    "link": "/rest/callback_group_ban.html"
                  },
                  {
                    "text": "Chat Group and Chat Room Mute-All Webhook Events",
                    "link": "/rest/callback_group_room_muteall.html"
                  },
                  {
                    "text": "Chat Group Block Status Change Webhook Events",
                    "link": "/rest/callback_group_block.html"
                  }
                ]
              },
              {
                "text": "Member and Permission Changes",
                "collapsible": true,
                "children": [
                  {
                    "text": "Chat Group and Chat Room Member Join Webhook Events",
                    "link": "/rest/callback_group_room_join.html"
                  },
                  {
                    "text": "Chat Group and Chat Room Member Leave Webhook Events",
                    "link": "/rest/callback_group_room_leave.html"
                  },
                  {
                    "text": "Chat Group and Chat Room Admin Change Webhook Events",
                    "link": "/rest/callback_group_room_admin.html"
                  },
                  {
                    "text": "Chat Group and Chat Room Mute List Webhook Events",
                    "link": "/rest/callback_group_room_mute.html"
                  },
                  {
                    "text": "Chat Group and Chat Room Allowlist Webhook Events",
                    "link": "/rest/callback_group_room_allowlist.html"
                  },
                  {
                    "text": "Chat Group and Chat Room Blocklist Webhook Events",
                    "link": "/rest/callback_group_room_blocklist.html"
                  },
                  {
                    "text": "Chat Room Superadmin Change Webhook Events",
                    "link": "/rest/callback_room_superadmin.html"
                  }
                ]
              },
              {
                "text": "Content and Resource Operations",
                "collapsible": true,
                "children": [
                  {
                    "text": "Chat Group Shared File Webhook Events",
                    "link": "/rest/callback_group_shared_file.html"
                  },
                  {
                    "text": "Message Thread Operation Webhook Events",
                    "link": "/rest/callback_thread.html"
                  }
                ]
              }
            ]
          },
          {
            "text": "Offline Push Webhook Events",
            "link": "/rest/callback_offline_push.html"
          },
          {
            "text": "Sensitive Word Detection Webhook Events",
            "link": "/rest/callback_sensitive_word.html"
          }
        ]
      },
      {
        "text": "Webhook Data Stored on the Chat Server",
        "link": "/rest/callback_postsending_exception_storage.html"
      }
    ],
    "only": [
      "server-side"
    ]
  },
  {
    "type": "separator",
    "only": [
      "server-side"
    ]
  },
  {
    "text": "Java Server SDK 2.0",
    "link": "/rest/java_server_sdk_2.0.html",
    "only": [
      "server-side"
    ]
  },
  {
    "text": "API Reference",
    "link": "/rest/apireference_java_2.0.html",
    "only": [
      "server-side"
    ]
  },
  {
    "text": "Feature Limitations",
    "link": "/rest/limitation.html",
    "only": [
      "server-side"
    ]
  }
] as const
