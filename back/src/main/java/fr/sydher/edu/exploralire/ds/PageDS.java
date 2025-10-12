package fr.sydher.edu.exploralire.ds;

import fr.sydher.edu.exploralire.entity.Page;
import fr.sydher.edu.exploralire.entity.Site;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class PageDS {

    public List<Page> findAll() {
        return Page.listAll();
    }

    public Page findById(Long id) {
        return Page.findById(id);
    }

    @Transactional
    public Page create(Page page) {
        page.persist();
        return page;
    }

    @Transactional
    public Page update(Long id, Page pageData) {
        Page page = Page.findById(id);
        if (page == null) {
            return null;
        }
        page.name = pageData.name;
        page.content = pageData.content;
        if (pageData.site != null) {
            Site site = Site.findById(pageData.site.id);
            if (site != null) {
                page.site = site;
            }
        }
        return page;
    }

    @Transactional
    public boolean delete(Long id) {
        return Page.deleteById(id);
    }

}
