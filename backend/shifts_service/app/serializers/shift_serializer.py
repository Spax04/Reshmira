def shift_entity(shift) -> dict:
    return {
        "id": str(shift["_id"]),
        "start_time": shift["start_time"],
        "end_time": shift["end_time"],
        "schedule_id": str(shift["schedule_id"]),
        "guards": [guard_assignment_entity(guard) for guard in shift["guards"]],
    }


def guard_assignment_entity(entity) -> dict:
    return {
        "guard_id": str(entity["guard_id"]),
        "guard_post_name": entity["guard_post_name"]
    }


def shifts_list_entity(shifts) -> list:
    return [shift_entity(shift) for shift in shifts]
