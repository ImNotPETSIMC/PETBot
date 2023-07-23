import * as register_member from "./register_member"
import * as register_project from "./register_project"
import * as update_member from "./update_member"
import * as update_project from "./update_project"
import * as remove_member from "./remove_member"
import * as remove_project from "./remove_project"
import * as search_member from "./search_member"
import * as status_member from "./status_member"
import * as status_project from "./status_project"

export const commands = {
    register_member,
    register_project,
    update_member,
    update_project,
    remove_member,
    remove_project,
    search_member,
    status_member,
    status_project
};