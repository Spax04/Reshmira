def schedule_entity(schedule) -> dict:
    return {
        "id": str(schedule["_id"]),
        "name": schedule["name"],
        "guards": [str(guard_id) for guard_id in schedule["guards"]],
        "shifts": [str(shift_id) for shift_id in schedule["shifts"]],
        "guard_posts": [str(guard_posts_name) for guard_posts_name in schedule["guard_posts"]],
        "min_rest_time": schedule["min_rest_time"],
        "max_rest_time": schedule["max_rest_time"],
        "shift_time": schedule["shift_time"],
        "created_at": schedule["created_at"],
        "updated_at": schedule["updated_at"]
    }
