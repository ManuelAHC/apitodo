<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $query = "UPDATE tasks SET";

    $params = array();

    if (isset($data->title)) {
        $query .= " title = :title,";
        $params[':title'] = $data->title;
    }

    if (isset($data->description)) {
        $query .= " description = :description,";
        $params[':description'] = $data->description;
    }

    if (isset($data->status)) {
        $query .= " status = :status,";
        $params[':status'] = $data->status;
    }

    $query = rtrim($query, ',');

    $query .= " WHERE id = :id";

    $stmt = $db->prepare($query);

    foreach ($params as $param => $value) {
        $stmt->bindParam($param, $value);
    }
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        echo json_encode(array("message" => "Task was updated."));
    } else {
        echo json_encode(array("message" => "Unable to update task."));
    }
} else {
    echo json_encode(array("message" => "Incomplete data."));
}
?>
