/** Complete English REST API and Webhooks sidebar. Menu labels are independent of Markdown H1 titles. */
export const REST_SIDEBAR = [
  {
    "text": "REST API Overview",
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
    "text": "Authentication",
    "collapsible": true,
    "children": [
      {
        "text": "App Token",
        "link": "/rest/easemob_app_token.html"
      },
      {
        "text": "User Token",
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
            "text": "Send to All Users",
            "link": "/rest/broadcast_to_all_users.html"
          },
          {
            "text": "Send to Online Users",
            "link": "/rest/broadcast_to_online_users.html"
          },
          {
            "text": "Send to Chat Rooms",
            "link": "/rest/broadcast_to_chatrooms.html"
          }
        ]
      },
      {
        "text": "Upload and Download Files",
        "collapsible": true,
        "children": [
          {
            "text": "Upload File",
            "link": "/rest/message_upload_file.html"
          },
          {
            "text": "Download File",
            "link": "/rest/message_download_file.html"
          },
          {
            "text": "Download Thumbnail",
            "link": "/rest/message_download_thumbnail.html"
          }
        ]
      },
      {
        "text": "Retrieve Historical Messages",
        "link": "/rest/message_historical.html"
      },
      {
        "text": "Set Storage for Message Attachments",
        "link": "/rest/message_attachment_storage.html"
      },
      {
        "text": "Message Reactions",
        "collapsible": true,
        "children": [
          {
            "text": "Add",
            "link": "/rest/reaction_add.html"
          },
          {
            "text": "Delete",
            "link": "/rest/reaction_delete.html"
          },
          {
            "text": "Retrieve by Msg ID",
            "link": "/rest/reaction_get_by_msg_id.html"
          },
          {
            "text": "Retrieve by Emoji ID",
            "link": "/rest/reaction_get_by_msg_id_emoji_id.html"
          }
        ]
      },
      {
        "text": "Recall Messages",
        "collapsible": true,
        "children": [
          {
            "text": "Recall Single",
            "link": "/rest/message_recall_single.html"
          },
          {
            "text": "Recall Bulk",
            "link": "/rest/message_recall_batch.html"
          }
        ]
      },
      {
        "text": "Delete Conversation",
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
        "text": "Edit Message",
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
        "text": "Import Message",
        "collapsible": true,
        "children": [
          {
            "text": "Import One-to-One Message",
            "link": "/rest/message_import_single.html"
          },
          {
            "text": "Import Group Message",
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
        "text": "Create",
        "link": "/rest/group_create.html"
      },
      {
        "text": "Retrieve",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve All",
            "link": "/rest/group_obtain_total.html"
          },
          {
            "text": "Retrieve Joined",
            "link": "/rest/group_obtain_joined.html"
          },
          {
            "text": "Retrieve Details",
            "link": "/rest/group_obtain_detail.html"
          }
        ]
      },
      {
        "text": "Manage Groups",
        "collapsible": true,
        "children": [
          {
            "text": "Modify",
            "link": "/rest/group_modify.html"
          },
          {
            "text": "Ban",
            "link": "/rest/group_ban.html"
          },
          {
            "text": "Unban",
            "link": "/rest/group_unban.html"
          },
          {
            "text": "Destroy",
            "link": "/rest/group_delete.html"
          }
        ]
      },
      {
        "text": "Announcement",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve",
            "link": "/rest/group_announcement_obtain.html"
          },
          {
            "text": "Modify",
            "link": "/rest/group_announcement_modify.html"
          }
        ]
      },
      {
        "text": "Shared Files",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve",
            "link": "/rest/group_shared_file_obtain.html"
          },
          {
            "text": "Upload",
            "link": "/rest/group_shared_file_upload.html"
          },
          {
            "text": "Download",
            "link": "/rest/group_shared_file_download.html"
          },
          {
            "text": "Delete",
            "link": "/rest/group_shared_file_delete.html"
          }
        ]
      },
      {
        "text": "Add Members",
        "collapsible": true,
        "children": [
          {
            "text": "Add Single",
            "link": "/rest/group_member_add_single.html"
          },
          {
            "text": "Add Bulk",
            "link": "/rest/group_members_add_batch.html"
          }
        ]
      },
      {
        "text": "Remove Members",
        "collapsible": true,
        "children": [
          {
            "text": "Remove Single",
            "link": "/rest/group_member_remove_single.html"
          },
          {
            "text": "Remove Bulk",
            "link": "/rest/group_members_remove_batch.html"
          }
        ]
      },
      {
        "text": "Manage Members",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve",
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
            "text": "Mute",
            "collapsible": true,
            "children": [
              {
                "text": "Mute Bulk",
                "link": "/rest/group_member_mute.html"
              },
              {
                "text": "Mute All",
                "link": "/rest/group_member_mute_all.html"
              },
              {
                "text": "Unmute Bulk",
                "link": "/rest/group_member_unmute.html"
              },
              {
                "text": "Unmute All",
                "link": "/rest/group_member_unmute_all.html"
              },
              {
                "text": "Retrieve",
                "link": "/rest/group_member_mutelist_obtain.html"
              }
            ]
          },
          {
            "text": "Allowlist",
            "collapsible": true,
            "children": [
              {
                "text": "Add Single",
                "link": "/rest/group_allowlist_add_single.html"
              },
              {
                "text": "Add Bulk",
                "link": "/rest/group_allowlist_add_batch.html"
              },
              {
                "text": "Remove Bulk",
                "link": "/rest/group_allowlist_remove.html"
              },
              {
                "text": "Retrieve",
                "link": "/rest/group_allowlist_query.html"
              }
            ]
          },
          {
            "text": "Blocklist",
            "collapsible": true,
            "children": [
              {
                "text": "Add Single",
                "link": "/rest/group_member_blocklist_add_single.html"
              },
              {
                "text": "Add Bulk",
                "link": "/rest/group_member_blocklist_add_batch.html"
              },
              {
                "text": "Remove Single",
                "link": "/rest/group_member_blocklist_remove_single.html"
              },
              {
                "text": "Remove Bulk",
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
            "text": "Custom Member Attributes",
            "collapsible": true,
            "children": [
              {
                "text": "Set Single",
                "link": "/rest/group_member_attribute_set.html"
              },
              {
                "text": "Set Bulk",
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
        "text": "Message Threads",
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
            "text": "Retrieve Joined",
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
        "text": "Superadmins",
        "collapsible": true,
        "children": [
          {
            "text": "Add",
            "link": "/rest/chatroom_superadmin_add.html"
          },
          {
            "text": "Retrieve",
            "link": "/rest/chatroom_superadmin_list_obtain.html"
          },
          {
            "text": "Remove",
            "link": "/rest/chatroom_superadmin_delete.html"
          }
        ]
      },
      {
        "text": "Create",
        "link": "/rest/chatroom_create.html"
      },
      {
        "text": "Retrieve",
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
            "text": "Modify",
            "link": "/rest/chatroom_modify.html"
          },
          {
            "text": "Destroy",
            "link": "/rest/chatroom_delete.html"
          }
        ]
      },
      {
        "text": "Announcement",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve",
            "link": "/rest/chatroom_announcement_get.html"
          },
          {
            "text": "Modify",
            "link": "/rest/chatroom_announcement_update.html"
          }
        ]
      },
      {
        "text": "Custom Attributes",
        "collapsible": true,
        "children": [
          {
            "text": "Set",
            "link": "/rest/chatroom_custom_attribute_set.html"
          },
          {
            "text": "Force Set",
            "link": "/rest/chatroom_custom_attribute_set_force.html"
          },
          {
            "text": "Retrieve",
            "link": "/rest/chatroom_custom_attribute_get.html"
          },
          {
            "text": "Delete",
            "link": "/rest/chatroom_custom_attribute_delete.html"
          },
          {
            "text": "Force Delete",
            "link": "/rest/chatroom_custom_attribute_delete_force.html"
          }
        ]
      },
      {
        "text": "Add Members",
        "collapsible": true,
        "children": [
          {
            "text": "Add Single",
            "link": "/rest/chatroom_member_add_single.html"
          },
          {
            "text": "Add Bulk",
            "link": "/rest/chatroom_member_add_batch.html"
          }
        ]
      },
      {
        "text": "Remove Members",
        "collapsible": true,
        "children": [
          {
            "text": "Remove Single",
            "link": "/rest/chatroom_member_remove_single.html"
          },
          {
            "text": "Remove Bulk",
            "link": "/rest/chatroom_member_remove_batch.html"
          }
        ]
      },
      {
        "text": "Manage Members",
        "collapsible": true,
        "children": [
          {
            "text": "Retrieve",
            "link": "/rest/chatroom_member_list_obtain.html"
          },
          {
            "text": "Owner and Admins",
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
                "text": "Mute Bulk",
                "link": "/rest/chatroom_member_mute.html"
              },
              {
                "text": "Mute All",
                "link": "/rest/chatroom_member_mute_all.html"
              },
              {
                "text": "Unmute Bulk",
                "link": "/rest/chatroom_member_unmute.html"
              },
              {
                "text": "Unmute All",
                "link": "/rest/chatroom_member_unmute_all.html"
              },
              {
                "text": "Retrieve",
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
                "text": "Overview",
                "link": "/rest/chatroom_allowlist_overview.html"
              },
              {
                "text": "Add Single",
                "link": "/rest/chatroom_allowlist_add_single.html"
              },
              {
                "text": "Add Bulk",
                "link": "/rest/chatroom_allowlist_add_batch.html"
              },
              {
                "text": "Remove Bulk",
                "link": "/rest/chatroom_allowlist_remove.html"
              },
              {
                "text": "Retrieve",
                "link": "/rest/chatroom_allowlist_obtain.html"
              }
            ]
          },
          {
            "text": "Blocklist",
            "collapsible": true,
            "children": [
              {
                "text": "Add Single",
                "link": "/rest/chatroom_member_blocklist_add_single.html"
              },
              {
                "text": "Add Bulk",
                "link": "/rest/chatroom_member_blocklist_add_batch.html"
              },
              {
                "text": "Remove Single",
                "link": "/rest/chatroom_member_blocklist_remove_single.html"
              },
              {
                "text": "Remove Bulk",
                "link": "/rest/chatroom_member_blocklist_remove_batch.html"
              },
              {
                "text": "Retrieve",
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
        "text": "Account",
        "collapsible": true,
        "children": [
          {
            "text": "Register Users",
            "collapsible": true,
            "children": [
              {
                "text": "Register One Without Authorization",
                "link": "/rest/account_register_open.html"
              },
              {
                "text": "Register Single with Authorization",
                "link": "/rest/account_register_authorized_single.html"
              },
              {
                "text": "Register Bulk with Authorization",
                "link": "/rest/account_register_authorized_batch.html"
              }
            ]
          },
          {
            "text": "Change a Password",
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
                "text": "Delete Single",
                "link": "/rest/account_delete_single.html"
              },
              {
                "text": "Delete Bulk",
                "link": "/rest/account_delete_batch.html"
              }
            ]
          },
          {
            "text": "Ban a User",
            "link": "/rest/account_ban.html"
          },
          {
            "text": "Unban",
            "link": "/rest/account_unban.html"
          },
          {
            "text": "Force Offline",
            "link": "/rest/account_offline_forced.html"
          },
          {
            "text": "Force Offline on Device",
            "link": "/rest/account_offline_device_single.html"
          },
          {
            "text": "Retrieve User Presence",
            "collapsible": true,
            "children": [
              {
                "text": "Retrieve Single User Presence",
                "link": "/rest/account_presence_obtain_single.html"
              },
              {
                "text": "Retrieve Bulk User Presence",
                "link": "/rest/account_presence_obtain_batch.html"
              }
            ]
          },
          {
            "text": "Retrieve Online Devices",
            "link": "/rest/account_online_device_obtain.html"
          }
        ]
      },
      {
        "text": "User Attributes",
        "collapsible": true,
        "children": [
          {
            "text": "Set",
            "link": "/rest/user_attribute_set.html"
          },
          {
            "text": "Delete",
            "link": "/rest/user_attribute_delete.html"
          },
          {
            "text": "Retrieve Single",
            "link": "/rest/user_attribute_obtain_single.html"
          },
          {
            "text": "Retrieve Bulk",
            "link": "/rest/user_attribute_obtain_batch.html"
          },
          {
            "text": "Get Total Size",
            "link": "/rest/user_attribute_capacity_get.html"
          }
        ]
      },
      {
        "text": "Presence Subscriptions",
        "collapsible": true,
        "children": [
          {
            "text": "Set Presence",
            "link": "/rest/presence_set.html"
          },
          {
            "text": "Subscribe to Presence",
            "link": "/rest/presence_subscribe.html"
          },
          {
            "text": "Unsubscribe from Presence",
            "link": "/rest/presence_unsubscribe.html"
          },
          {
            "text": "Retrieve Subscription List",
            "link": "/rest/presence_subscription_list_obtain.html"
          },
          {
            "text": "Retrieve Presence in Batches",
            "link": "/rest/presence_get.html"
          },
          {
            "text": "Retrieve Online Group Member Count",
            "link": "/rest/presence_group_online_count_obtain.html"
          }
        ]
      },
      {
        "text": "User Relationships",
        "collapsible": true,
        "children": [
          {
            "text": "Add Friend",
            "link": "/rest/user_friend_add.html"
          },
          {
            "text": "Check Friends",
            "link": "/rest/user_friend_check.html"
          },
          {
            "text": "Remove Friend",
            "link": "/rest/user_friend_remove.html"
          },
          {
            "text": "Remove All Friends",
            "link": "/rest/user_friend_remove_all.html"
          },
          {
            "text": "Set Friend Remarks",
            "link": "/rest/user_friend_remark_set.html"
          },
          {
            "text": "Retrieve by Page",
            "link": "/rest/user_friend_list_paged.html"
          },
          {
            "text": "Retrieve All",
            "link": "/rest/user_friend_list_obtain.html"
          },
          {
            "text": "Import Friend List",
            "link": "/rest/user_friend_import.html"
          },
          {
            "text": "Add to Blocklist",
            "link": "/rest/user_friend_blocklist_add.html"
          },
          {
            "text": "Remove from Blocklist",
            "link": "/rest/user_friend_blocklist_remove.html"
          },
          {
            "text": "Retrieve Blocklist",
            "link": "/rest/user_friend_blocklist_obtain.html"
          },
          {
            "text": "Check Blocklist",
            "link": "/rest/user_friend_blocklist_check.html"
          }
        ]
      },
      {
        "text": "Global User Mute",
        "collapsible": true,
        "children": [
          {
            "text": "Overview",
            "link": "/rest/user_global_mute_overview.html"
          },
          {
            "text": "Set",
            "link": "/rest/user_global_mute_set.html"
          },
          {
            "text": "Query Single",
            "link": "/rest/user_global_mute_query_single.html"
          },
          {
            "text": "Query All",
            "link": "/rest/user_global_mute_query_all.html"
          }
        ]
      },
      {
        "text": "User Favorites",
        "collapsible": true,
        "children": [
          {
            "text": "Add One",
            "link": "/rest/user_collection_add_single.html"
          },
          {
            "text": "Add Batch",
            "link": "/rest/user_collection_add_batch.html"
          },
          {
            "text": "Modify Extension",
            "link": "/rest/user_collection_ext_modify.html"
          },
          {
            "text": "Delete",
            "link": "/rest/user_collection_delete.html"
          },
          {
            "text": "Retrieve",
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
        "text": "Configure Push",
        "collapsible": true,
        "children": [
          {
            "text": "Bind and Unbind Push Info",
            "link": "/rest/push_information_bind_unbind.html"
          },
          {
            "text": "Retrieve Push Binding Info",
            "link": "/rest/push_information_bind_query.html"
          },
          {
            "text": "Set Single Nickname",
            "link": "/rest/push_nickname_set_single.html"
          },
          {
            "text": "Set Bulk Nicknames",
            "link": "/rest/push_nickname_set_batch.html"
          },
          {
            "text": "Set Notification Display",
            "link": "/rest/push_display_mode_set.html"
          },
          {
            "text": "Configure Push",
            "link": "/rest/push_settings_set.html"
          },
          {
            "text": "Retrieve Push Settings",
            "link": "/rest/push_settings_query.html"
          },
          {
            "text": "Use Push Templates",
            "collapsible": true,
            "children": [
              {
                "text": "Overview",
                "link": "/rest/push_template_overview.html"
              },
              {
                "text": "Create",
                "link": "/rest/push_template_create.html"
              },
              {
                "text": "Delete",
                "link": "/rest/push_template_delete.html"
              },
              {
                "text": "Query",
                "link": "/rest/push_template_query.html"
              },
              {
                "text": "Use for Sender",
                "link": "/rest/push_template_send_message.html"
              },
              {
                "text": "Use for Recipient",
                "link": "/rest/push_template_receiver.html"
              }
            ]
          },
          {
            "text": "Error Codes",
            "link": "/rest/push_error.html"
          }
        ]
      },
      {
        "text": "Message Extensions",
        "link": "/rest/push_extension.html"
      },
      {
        "text": "Push Statistics",
        "link": "/rest/push_result_statistics.html"
      }
    ],
    "only": [
      "server-side"
    ]
  },
  {
    "text": "Error Codes",
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
        "text": "Overview",
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
    "text": "Java Server SDK API Reference",
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
