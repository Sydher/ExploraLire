package fr.sydher.edu.exploralire.ds;

import fr.sydher.edu.exploralire.dto.label.CreateLabelDTO;
import fr.sydher.edu.exploralire.dto.label.LabelDTO;
import fr.sydher.edu.exploralire.dto.label.UpdateLabelDTO;
import fr.sydher.edu.exploralire.entity.LabelEntity;
import fr.sydher.edu.exploralire.exception.LabelNotFoundException;
import fr.sydher.edu.exploralire.repository.LabelRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class LabelDS {

    @Inject
    LabelRepository labelRepository;

    public List<LabelDTO> getAll() {
        return labelRepository.streamAll().map(LabelDTO::fromEntity).collect(Collectors.toList());
    }

    public LabelDTO get(Long id) throws LabelNotFoundException {
        LabelEntity labelEntity = getEntity(id);
        return LabelDTO.fromEntity(labelEntity);
    }

    protected LabelEntity getEntity(Long id) throws LabelNotFoundException {
        LabelEntity labelEntity = labelRepository.findById(id);

        if (labelEntity == null) {
            throw new LabelNotFoundException(id);
        }

        return labelEntity;
    }

    @Transactional
    public LabelDTO create(CreateLabelDTO dto) {
        LabelEntity labelEntity = dto.toEntity();
        labelRepository.persist(labelEntity);
        return LabelDTO.fromEntity(labelEntity);
    }

    @Transactional
    public LabelDTO update(Long id, UpdateLabelDTO dto) throws LabelNotFoundException {
        LabelEntity labelEntity = labelRepository.findById(id);

        if (labelEntity == null) {
            throw new LabelNotFoundException(id);
        }

        labelEntity.name = dto.name();
        labelRepository.persist(labelEntity);

        return LabelDTO.fromEntity(labelEntity);
    }

    @Transactional
    public void delete(Long id) throws LabelNotFoundException {
        LabelEntity labelEntity = labelRepository.findById(id);

        if (labelEntity == null) {
            throw new LabelNotFoundException(id);
        }

        labelRepository.delete(labelEntity);
    }

}
