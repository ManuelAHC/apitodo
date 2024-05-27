<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT * FROM tasks";
$stmt = $db->prepare($query);
$stmt->execute();

$num = $stmt->rowCount();

if ($num > 0) {
    $tasks_arr = array();
    $tasks_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $task_item = array(
            "id" => $id,
            "title" => $title,
            "description" => $description,
            "status" => $status,
            "created_at" => $created_at
        );
        array_push($tasks_arr["records"], $task_item);
    }

    echo json_encode($tasks_arr);
} else {
    echo json_encode(array("message" => "No tasks found."));
}
?>
