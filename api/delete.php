<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $query = "DELETE FROM tasks WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        echo json_encode(array("message" => "Task was deleted."));
    } else {
        echo json_encode(array("message" => "Unable to delete task."));
    }
} else {
    echo json_encode(array("message" => "Incomplete data."));
}
?>
