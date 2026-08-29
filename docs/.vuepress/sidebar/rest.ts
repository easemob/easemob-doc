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
    "text": "API Call Frequency Limits",
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
        "text": "Authenticate with App Token",
        "link": "/rest/easemob_app_token.html"
      },
      {
        "text": "Authenticate with User Token",
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
            "text": "Send One-to-One Streaming Messages",
            "link": "/rest/message_stream_send_single.html"
          },
          {
            "text": "Send Group Streaming Messages",
            "link": "/rest/message_stream_send_group.html"
          }
        ]
      },
      {
        "text": "Send Global Broadcast Messages",
        "collapsible": true,
        "children": [
          {
            "text": "Send a Broadcast Message to All Users",
            "link": "/rest/broadcast_to_all_users.html"
          },
          {
            "text": "Send a Broadcast Message to Online Users",
            "link": "/rest/broadcast_to_online_users.html"
          },
          {
            "text": "Send a Broadcast Message to Chat Rooms",
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
            "text": "Download a Thumbnail",
            "link": "/rest/message_download_thumbnail.html"
          }
        ]
      },
      {
        "text": "Retrieve Historical Messages",
        "link": "/rest/message_historical.html"
      },
      {
        "text": "Set the Storage Method for Message Attachments",
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
            "text": "Retrieve Reaction List",
            "link": "/rest/reaction_get_by_msg_id.html"
          },
          {
            "text": "Retrieve Reaction by Emoji ID",
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
        "text": "Delete a Conversation for a User",
        "link": "/rest/conversation_delete.html"
      },
      {
        "text": "Delete Roaming Messages",
        "collapsible": true,
        "children": [
          {
            "text": "Delete by Msg ID (One-to-One)",
            "link": "/rest/message_delete_roam_single_msgid.html"
          },
          {
            "text": "Delete by Msg ID (Group/Room)",
            "link": "/rest/message_delete_roam_group_room_msgid.html"
          },
          {
            "text": "Delete All",
            "link": "/rest/message_delete_roam_user.html"
          },
          {
            "text": "Delete by Time (One-to-One)",
            "link": "/rest/message_delete_roam_single_time.html"
          },
          {
            "text": "Delete by Time (Group/Room)",
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
            "text": "Retrieve Message Count",
            "link": "/rest/offline_msg_count_get.html"
          },
          {
            "text": "Retrieve Delivery Status",
            "link": "/rest/offline_msg_status_get.html"
          }
        ]
      },
      {
        "text": "Import Messages",
        "collapsible": true,
        "children": [
          {
            "text": "Import Messages（One-to-One）",
            "link": "/rest/message_import_single.html"
          },
          {
            "text": "Import Messages（Group）",
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
            "text": "Retrieve Chat Groups",
            "link": "/rest/group_obtain_total.html"
          },
          {
            "text": "Retrieve Joined Chat Groups",
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
            "text": "Modify Group",
            "link": "/rest/group_modify.html"
          },
          {
            "text": "Ban Group",
            "link": "/rest/group_ban.html"
          },
          {
            "text": "Unban Group",
            "link": "/rest/group_unban.html"
          },
          {
            "text": "Destroy Group",
            "link": "/rest/group_delete.html"
          }
        ]
      },
      {
        "text": "Manage Chat Group Announcements",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve Announcement",
            "link": "/rest/group_announcement_obtain.html"
          },
          {
            "text": "Modify Announcement",
            "link": "/rest/group_announcement_modify.html"
          }
        ]
      },
      {
        "text": "Manage Chat Group Shared Files",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve Shared Files",
            "link": "/rest/group_shared_file_obtain.html"
          },
          {
            "text": "Upload a Shared File",
            "link": "/rest/group_shared_file_upload.html"
          },
          {
            "text": "Download a Shared File",
            "link": "/rest/group_shared_file_download.html"
          },
          {
            "text": "Delete a Shared File",
            "link": "/rest/group_shared_file_delete.html"
          }
        ]
      },
      {
        "text": "Add Chat Group Members",
        "collapsible": true,
        "children": [
          {
            "text": "Add One",
            "link": "/rest/group_member_add_single.html"
          },
          {
            "text": "Add Batch",
            "link": "/rest/group_members_add_batch.html"
          }
        ]
      },
      {
        "text": "Remove Chat Group Members",
        "collapsible": true,
        "children": [
          {
            "text": "Remove One",
            "link": "/rest/group_member_remove_single.html"
          },
          {
            "text": "Remove Batch",
            "link": "/rest/group_members_remove_batch.html"
          }
        ]
      },
      {
        "text": "Manage Chat Group Members",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve Members",
            "link": "/rest/group_member_list_obtain.html"
          },
          {
            "text": "Owner and Admins",
            "collapsible": true,
            "children": [
              {
                "text": "Transfer Ownership",
                "link": "/rest/group_owner_transfer.html"
              },
              {
                "text": "Add Admin",
                "link": "/rest/group_admin_add.html"
              },
              {
                "text": "Retrieve Admin List",
                "link": "/rest/group_admin_list_get.html"
              },
              {
                "text": "Remove Admin",
                "link": "/rest/group_admin_remove.html"
              }
            ]
          },
          {
            "text": "Mutes",
            "collapsible": true,
            "children": [
              {
                "text": "Mute Members",
                "link": "/rest/group_member_mute.html"
              },
              {
                "text": "Mute All",
                "link": "/rest/group_member_mute_all.html"
              },
              {
                "text": "Unmute Members",
                "link": "/rest/group_member_unmute.html"
              },
              {
                "text": "Unmute All",
                "link": "/rest/group_member_unmute_all.html"
              },
              {
                "text": "Retrieve Mute List",
                "link": "/rest/group_member_mutelist_obtain.html"
              }
            ]
          },
          {
            "text": "Allowlist",
            "collapsible": true,
            "children": [
              {
                "text": "Add One",
                "link": "/rest/group_allowlist_add_single.html"
              },
              {
                "text": "Add Batch",
                "link": "/rest/group_allowlist_add_batch.html"
              },
              {
                "text": "Remove Batch",
                "link": "/rest/group_allowlist_remove.html"
              },
              {
                "text": "Retrieve Allowlist",
                "link": "/rest/group_allowlist_query.html"
              }
            ]
          },
          {
            "text": "Blocklist",
            "collapsible": true,
            "children": [
              {
                "text": "Add One",
                "link": "/rest/group_member_blocklist_add_single.html"
              },
              {
                "text": "Add Batch",
                "link": "/rest/group_member_blocklist_add_batch.html"
              },
              {
                "text": "Remove One",
                "link": "/rest/group_member_blocklist_remove_single.html"
              },
              {
                "text": "Remove Batch",
                "link": "/rest/group_member_blocklist_remove_batch.html"
              },
              {
                "text": "Retrieve",
                "link": "/rest/group_member_blocklist_obtain.html"
              }
            ]
          },
          {
            "text": "Check Membership",
            "link": "/rest/group_check_joined.html"
          },
          {
            "text": "Manage Custom Member Attributes",
            "collapsible": true,
            "children": [
              {
                "text": "Set",
                "link": "/rest/group_member_attribute_set.html"
              },
              {
                "text": "Batch Set",
                "link": "/rest/group_member_attribute_set_batch.html"
              },
              {
                "text": "Retrieve All",
                "link": "/rest/group_member_attribute_get.html"
              },
              {
                "text": "Retrieve by Key",
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
            "text": "Create",
            "link": "/rest/group_thread_create.html"
          },
          {
            "text": "Modify",
            "link": "/rest/group_thread_modify.html"
          },
          {
            "text": "Delete",
            "link": "/rest/group_thread_delete.html"
          },
          {
            "text": "Retrieve All",
            "link": "/rest/group_thread_obtain.html"
          },
          {
            "text": "Retrieve Joined Threads",
            "link": "/rest/group_thread_joined.html"
          },
          {
            "text": "Retrieve by Group",
            "link": "/rest/group_threads_in_group.html"
          },
          {
            "text": "Retrieve Members",
            "link": "/rest/group_thread_member_get.html"
          },
          {
            "text": "Add Members",
            "link": "/rest/group_thread_member_add.html"
          },
          {
            "text": "Remove Members",
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
            "text": "Add Superadmin",
            "link": "/rest/chatroom_superadmin_add.html"
          },
          {
            "text": "Retrieve Superadmin List",
            "link": "/rest/chatroom_superadmin_list_obtain.html"
          },
          {
            "text": "Remove Superadmin",
            "link": "/rest/chatroom_superadmin_delete.html"
          }
        ]
      },
      {
        "text": "Create Chat Room",
        "link": "/rest/chatroom_create.html"
      },
      {
        "text": "Retrieve Chat Rooms",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve All",
            "link": "/rest/chatroom_obtain_total.html"
          },
          {
            "text": "Retrieve Joined",
            "link": "/rest/chatroom_obtain_joined.html"
          },
          {
            "text": "Retrieve Details",
            "link": "/rest/chatroom_obtain_detail.html"
          }
        ]
      },
      {
        "text": "Manage Chat Rooms",
        "collapsible": true,
        "children": [
          {
            "text": "Modify Basic Info",
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
            "text": "Retrieve Announcement",
            "link": "/rest/chatroom_announcement_get.html"
          },
          {
            "text": "Modify Announcement",
            "link": "/rest/chatroom_announcement_update.html"
          },
          {
            "text": "Set Custom Attributes",
            "link": "/rest/chatroom_custom_attribute_set.html"
          },
          {
            "text": "Force Set Custom Attributes",
            "link": "/rest/chatroom_custom_attribute_set_force.html"
          },
          {
            "text": "Retrieve Custom Attributes",
            "link": "/rest/chatroom_custom_attribute_get.html"
          },
          {
            "text": "Delete Custom Attributes",
            "link": "/rest/chatroom_custom_attribute_delete.html"
          },
          {
            "text": "Force Delete Custom Attributes",
            "link": "/rest/chatroom_custom_attribute_delete_force.html"
          }
        ]
      },
      {
        "text": "Add Chat Room Members",
        "collapsible": true,
        "children": [
          {
            "text": "Add One",
            "link": "/rest/chatroom_member_add_single.html"
          },
          {
            "text": "Add Batch",
            "link": "/rest/chatroom_member_add_batch.html"
          }
        ]
      },
      {
        "text": "Remove Chat Room Members",
        "collapsible": true,
        "children": [
          {
            "text": "Remove one",
            "link": "/rest/chatroom_member_remove_single.html"
          },
          {
            "text": "Remove Batch",
            "link": "/rest/chatroom_member_remove_batch.html"
          }
        ]
      },
      {
        "text": "Manage Chat Room Members",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve Member List",
            "link": "/rest/chatroom_member_list_obtain.html"
          },
          {
            "text": "Manage Owner and Admins",
            "collapsible": true,
            "children": [
              {
                "text": "Transfer Ownership",
                "link": "/rest/chatroom_owner_transfer.html"
              },
              {
                "text": "Add Admin",
                "link": "/rest/chatroom_admin_add.html"
              },
              {
                "text": "Retrieve Admin List",
                "link": "/rest/chatroom_admin_list_get.html"
              },
              {
                "text": "Remove Admin",
                "link": "/rest/chatroom_admin_remove.html"
              }
            ]
          },
          {
            "text": "Mute",
            "collapsible": true,
            "children": [
              {
                "text": "Mute Members",
                "link": "/rest/chatroom_member_mute.html"
              },
              {
                "text": "Mute All",
                "link": "/rest/chatroom_member_mute_all.html"
              },
              {
                "text": "Unmute Members",
                "link": "/rest/chatroom_member_unmute.html"
              },
              {
                "text": "Unmute All",
                "link": "/rest/chatroom_member_unmute_all.html"
              },
              {
                "text": "Retrieve Mute List",
                "link": "/rest/chatroom_member_mutelist_obtain.html"
              },
              {
                "text": "Mute by Room Tag",
                "link": "/rest/chatroom_user_tag_mute.html"
              },
              {
                "text": "Set Room Tags by User",
                "link": "/rest/chatroom_user_tag_set.html"
              },
              {
                "text": "Retrieve Room Tags by User",
                "link": "/rest/chatroom_user_tag_get.html"
              }
            ]
          },
          {
            "text": "Allowlist",
            "collapsible": true,
            "children": [
              {
                "text": "Overvie",
                "link": "/rest/chatroom_allowlist_overview.html"
              },
              {
                "text": "Add One to Allowlist",
                "link": "/rest/chatroom_allowlist_add_single.html"
              },
              {
                "text": "Add Batch to Allowlist",
                "link": "/rest/chatroom_allowlist_add_batch.html"
              },
              {
                "text": "Remove from Allowlist",
                "link": "/rest/chatroom_allowlist_remove.html"
              },
              {
                "text": "Retrieve Allowlist",
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
            "text": "User Status",
            "link": "/rest/callback_login_logout.html"
          },
          {
            "text": "Friend and Blocklist",
            "link": "/rest/callback_contact.html"
          },
          {
            "text": "Message",
            "collapsible": true,
            "children": [
              {
                "text": "Message Sending",
                "link": "/rest/callback_message_send.html"
              },
              {
                "text": "One-to-One Message Read Receipt",
                "link": "/rest/callback_single_read_ack.html"
              },
              {
                "text": "Group Message Read Receipt",
                "link": "/rest/callback_group_read_ack.html"
              },
              {
                "text": "Message Editing",
                "link": "/rest/callback_message_modify.html"
              },
              {
                "text": "Message Recall",
                "link": "/rest/callback_message_recall.html"
              },
              {
                "text": "Reaction",
                "link": "/rest/callback_reaction.html"
              }
            ]
          },
          {
            "text": "Chat Group and Chat Room",
            "collapsible": true,
            "children": [
              {
                "text": "Creation and Deletion",
                "collapsible": true,
                "children": [
                  {
                    "text": "Creation",
                    "link": "/rest/callback_group_room_create.html"
                  },
                  {
                    "text": "Deletion",
                    "link": "/rest/callback_group_room_delete.html"
                  }
                ]
              },
              {
                "text": "Info and Status Changes",
                "collapsible": true,
                "children": [
                  {
                    "text": "Basic Info",
                    "link": "/rest/callback_group_room_info.html"
                  },
                  {
                    "text": "Owner",
                    "link": "/rest/callback_group_room_owner.html"
                  },
                  {
                    "text": "Announcement",
                    "link": "/rest/callback_group_room_announcement.html"
                  },
                  {
                    "text": "Group Ban Status",
                    "link": "/rest/callback_group_ban.html"
                  },
                  {
                    "text": "Mute-All",
                    "link": "/rest/callback_group_room_muteall.html"
                  },
                  {
                    "text": "Group Block Status",
                    "link": "/rest/callback_group_block.html"
                  }
                ]
              },
              {
                "text": "Member and Permission Changes",
                "collapsible": true,
                "children": [
                  {
                    "text": "Member Join",
                    "link": "/rest/callback_group_room_join.html"
                  },
                  {
                    "text": "Member Leave",
                    "link": "/rest/callback_group_room_leave.html"
                  },
                  {
                    "text": "Admin",
                    "link": "/rest/callback_group_room_admin.html"
                  },
                  {
                    "text": "Mute List",
                    "link": "/rest/callback_group_room_mute.html"
                  },
                  {
                    "text": "Allowlist",
                    "link": "/rest/callback_group_room_allowlist.html"
                  },
                  {
                    "text": "Blocklist",
                    "link": "/rest/callback_group_room_blocklist.html"
                  },
                  {
                    "text": "Room Superadmin",
                    "link": "/rest/callback_room_superadmin.html"
                  }
                ]
              },
              {
                "text": "Content and Resource Operations",
                "collapsible": true,
                "children": [
                  {
                    "text": "Group Shared File",
                    "link": "/rest/callback_group_shared_file.html"
                  },
                  {
                    "text": "Message Thread",
                    "link": "/rest/callback_thread.html"
                  }
                ]
              }
            ]
          },
          {
            "text": "Offline Push",
            "link": "/rest/callback_offline_push.html"
          }
        ]
      },
      {
        "text": "Webhook Data Storage on the Chat Server",
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
