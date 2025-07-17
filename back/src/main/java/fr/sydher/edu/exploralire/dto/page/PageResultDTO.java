package fr.sydher.edu.exploralire.dto.page;

import java.util.List;

public record PageResultDTO(List<PageDTO> items, long total) {

    // Empty

}
