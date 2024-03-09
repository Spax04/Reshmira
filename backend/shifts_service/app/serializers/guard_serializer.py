def guard_entity(guard) -> dict:
    return {
        "id": str(guard["_id"]),
        "name": guard["name"],
        "schedule_id": guard["schedule_id"],
        "shifts": [str(shift_id) for shift_id in guard["shifts"]],
        "created_at": guard["created_at"],
        "updated_at": guard["updated_at"]
    }




def guard_response_entity(guard) -> dict:
    return {
        "id": str(guard["_id"]),
        "name": guard["name"],
        "email": guard["email"],
        "created_at": guard["created_at"],
        "updated_at": guard["updated_at"]
    }


def embedded_user_response(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
    }


def guard_list_entity(guards) -> list:
    return [guard_entity(guard) for guard in guards]

