// Armazenamento de dados (simulando um banco de dados)
let partsDatabase = JSON.parse(localStorage.getItem('apqp_parts')) || [];
let suppliersDatabase = JSON.parse(localStorage.getItem('apqp_suppliers')) || [];

// Funções para o gestor
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar se estiver na página do gestor
    if (document.getElementById('part-form')) {
        initManagerPage();
    }
    
    // Inicializar se estiver na página do fornecedor
    if (document.getElementById('supplier-pending-list')) {
        initSupplierPage();
    }
    
    // Atualizar contadores
    updateCounters();
});

function initManagerPage() {
    const form = document.getElementById('part-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const partData = {
            id: Date.now().toString(),
            partNumber: document.getElementById('part-number').value,
            partDescription: document.getElementById('part-description').value,
            contractedVolume: document.getElementById('contracted-volume').value,
            weeklyVolume: document.getElementById('weekly-volume').value,
            supplierEmail: document.getElementById('supplier-email').value,
            dueWeeks: document.getElementById('due-date').value,
            status: 'pending', // pending, completed, approved
            createdDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + (parseInt(document.getElementById('due-date').value) * 7 * 24 * 60 * 60 * 1000)).toISOString(),
            milestones: {
                vff: null,
                pvs: null,
                os: null,
                sop: null
            },
            supplierSignature: null,
            supplierNotes: null,
            completedDate: null,
            approvedDate: null
        };
        
        // Adicionar ao banco de dados
        partsDatabase.push(partData);
        localStorage.setItem('apqp_parts', JSON.stringify(partsDatabase));
        
        // Enviar email simulado
        sendEmailToSupplier(partData);
        
        // Resetar formulário
        form.reset();
        
        // Mostrar mensagem de sucesso
        alert('Peça cadastrada com sucesso! Email enviado para o fornecedor.');
        
        // Atualizar listas
        updatePendingList();
        updateAllPartsList();
        updateCounters();
    });
    
    // Inicializar listas
    updatePendingList();
    updateAllPartsList();
    
    // Configurar tabs
    setupTabs();
}

function initSupplierPage() {
    // Carregar pendências do fornecedor
    updateSupplierPendingList();
    
    // Configurar modal
    setupModal();
    
    // Configurar formulário de milestones
    const milestoneForm = document.getElementById('milestone-form');
    if (milestoneForm) {
        milestoneForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const partId = this.dataset.partId;
            const partIndex = partsDatabase.findIndex(p => p.id === partId);
            
            if (partIndex !== -1) {
                // Atualizar dados
                partsDatabase[partIndex].milestones.vff = document.getElementById('vff-date').value;
                partsDatabase[partIndex].milestones.pvs = document.getElementById('pvs-date').value;
                partsDatabase[partIndex].milestones.os = document.getElementById('os-date').value;
                partsDatabase[partIndex].milestones.sop = document.getElementById('sop-date').value;
                partsDatabase[partIndex].supplierSignature = document.getElementById('supplier-signature').value;
                partsDatabase[partIndex].supplierNotes = document.getElementById('supplier-notes').value;
                partsDatabase[partIndex].completedDate = new Date().toISOString();
                partsDatabase[partIndex].status = 'completed';
                
                // Salvar no localStorage
                localStorage.setItem('apqp_parts', JSON.stringify(partsDatabase));
                
                // Enviar email simulado para o gestor
                sendEmailToManager(partsDatabase[partIndex]);
                
                // Fechar modal
                closeModal();
                
                // Atualizar lista
                updateSupplierPendingList();
                
                // Mostrar mensagem
                alert('Prazos enviados com sucesso! O gestor será notificado.');
            }
        });
    }
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.textContent.toLowerCase().includes('nova') ? 'register' :
                         this.textContent.toLowerCase().includes('pendentes') ? 'pending' : 'all';
            
            // Remover classe active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adicionar classe active ao selecionado
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function setupModal() {
    const modal = document.getElementById('milestone-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });
    
    // Fechar modal clicando fora
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function openMilestoneModal(partId) {
    const part = partsDatabase.find(p => p.id === partId);
    if (!part) return;
    
    // Preencher informações no modal
    document.getElementById('modal-part-number').textContent = `Peça: ${part.partNumber}`;
    document.getElementById('modal-part-description').textContent = part.partDescription;
    document.getElementById('modal-volume').textContent = part.contractedVolume;
    document.getElementById('modal-weekly').textContent = part.weeklyVolume;
    
    // Preencher datas se existirem
    if (part.milestones.vff) {
        document.getElementById('vff-date').value = part.milestones.vff;
    }
    if (part.milestones.pvs) {
        document.getElementById('pvs-date').value = part.milestones.pvs;
    }
    if (part.milestones.os) {
        document.getElementById('os-date').value = part.milestones.os;
    }
    if (part.milestones.sop) {
        document.getElementById('sop-date').value = part.milestones.sop;
    }
    
    // Definir ID da peça no formulário
    document.getElementById('milestone-form').dataset.partId = partId;
    
    // Mostrar modal
    document.getElementById('milestone-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('milestone-modal').style.display = 'none';
}

function updatePendingList() {
    const pendingList = document.getElementById('pending-list');
    if (!pendingList) return;
    
    const pendingParts = partsDatabase.filter(p => p.status === 'completed');
    
    if (pendingParts.length === 0) {
        pendingList.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Nenhuma peça pendente de validação</strong>
                    <p>Todas as peças foram validadas ou aguardam resposta do fornecedor</p>
                </div>
            </div>
        `;
        return;
    }
    
    pendingList.innerHTML = pendingParts.map(part => `
        <div class="part-item completed">
            <div class="part-header">
                <div class="part-title">${part.partNumber} - ${part.partDescription}</div>
                <div class="part-status status-completed">Aguardando Validação</div>
            </div>
            <div class="part-details">
                <div class="detail-item">
                    <i class="fas fa-envelope"></i>
                    <span>Fornecedor: ${part.supplierEmail}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Preenchido em: ${new Date(part.completedDate).toLocaleDateString('pt-BR')}</span>
                </div>
            </div>
            <div class="milestone-preview">
                <h4>Datas Propostas:</h4>
                <div class="milestone-grid">
                    <div class="milestone">
                        <h4>VFF</h4>
                        <p>${part.milestones.vff ? new Date(part.milestones.vff).toLocaleDateString('pt-BR') : 'Não definido'}</p>
                    </div>
                    <div class="milestone">
                        <h4>PVS</h4>
                        <p>${part.milestones.pvs ? new Date(part.milestones.pvs).toLocaleDateString('pt-BR') : 'Não definido'}</p>
                    </div>
                    <div class="milestone">
                        <h4>0S</h4>
                        <p>${part.milestones.os ? new Date(part.milestones.os).toLocaleDateString('pt-BR') : 'Não definido'}</p>
                    </div>
                    <div class="milestone">
                        <h4>SOP</h4>
                        <p>${part.milestones.sop ? new Date(part.milestones.sop).toLocaleDateString('pt-BR') : 'Não definido'}</p>
                    </div>
                </div>
            </div>
            <div class="part-actions">
                <button class="action-btn primary" onclick="approvePart('${part.id}')">
                    <i class="fas fa-check"></i> Aprovar
                </button>
                <button class="action-btn secondary" onclick="requestChanges('${part.id}')">
                    <i class="fas fa-edit"></i> Solicitar Alterações
                </button>
            </div>
        </div>
    `).join('');
}

function updateAllPartsList() {
    const allList = document.getElementById('all-parts-list');
    if (!allList) return;
    
    if (partsDatabase.length === 0) {
        allList.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>Nenhuma peça cadastrada</strong>
                    <p>Use o formulário "Nova Peça" para começar</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Ordenar por data de criação (mais recente primeiro)
    const sortedParts = [...partsDatabase].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    
    allList.innerHTML = sortedParts.map(part => {
        const statusClass = part.status === 'pending' ? 'pending' : 
                          part.status === 'completed' ? 'completed' : 'approved';
        const statusText = part.status === 'pending' ? 'Aguardando Fornecedor' :
                          part.status === 'completed' ? 'Aguardando Validação' : 'Aprovado';
        
        return `
        <div class="part-item ${statusClass}">
            <div class="part-header">
                <div class="part-title">${part.partNumber} - ${part.partDescription}</div>
                <div class="part-status status-${part.status}">${statusText}</div>
            </div>
            <div class="part-details">
                <div class="detail-item">
                    <i class="fas fa-boxes"></i>
                    <span>Volume: ${part.contractedVolume}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-chart-line"></i>
                    <span>Semana: ${part.weeklyVolume}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-envelope"></i>
                    <span>${part.supplierEmail}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Prazo: ${new Date(part.dueDate).toLocaleDateString('pt-BR')}</span>
                </div>
            </div>
            ${part.status === 'completed' || part.status === 'approved' ? `
            <div class="milestone-preview">
                <h4>Datas dos Milestones:</h4>
                <div class="milestone-grid">
                    <div class="milestone">
                        <h4>VFF</h4>
                        <p>${part.milestones.vff ? new Date(part.milestones.vff).toLocaleDateString('pt-BR') : 'Não definido'}</p>
                    </div>
                    <div class="milestone">
                        <h4>PVS</h4>
                        <p>${part.milestones.pvs ? new Date(part.milestones.pvs).toLocaleDateString('pt-BR') : 'Não definido'}</p>
                    </div>
                    <div class="milestone">
                        <h4>0S</h4>
                        <p>${part.milestones.os ? new Date(part.milestones.os).toLocaleDateString('pt-BR') : 'Não definido'}</p>
                    </div>
                    <div class="milestone">
                        <h4>SOP</h4>
                        <p>${part.milestones.sop ? new Date(part.milestones.sop).toLocaleDateString('pt-BR') : 'Não definido'}</p>
                    </div>
                </div>
            </div>
            ` : ''}
            <div class="part-actions">
                ${part.status === 'pending' ? `
                    <button class="action-btn secondary" onclick="remindSupplier('${part.id}')">
                        <i class="fas fa-bell"></i> Relembrar Fornecedor
                    </button>
                ` : ''}
                ${part.status === 'completed' ? `
                    <button class="action-btn primary" onclick="approvePart('${part.id}')">
                        <i class="fas fa-check"></i> Aprovar
                    </button>
                ` : ''}
                ${part.status === 'approved' ? `
                    <button class="action-btn secondary" onclick="viewDetails('${part.id}')">
                        <i class="fas fa-eye"></i> Ver Detalhes
                    </button>
                ` : ''}
            </div>
        </div>
        `;
    }).join('');
}

function updateSupplierPendingList() {
    const supplierList = document.getElementById('supplier-pending-list');
    const pendingCount = document.getElementById('supplier-pending-count');
    
    if (!supplierList) return;
    
    // Filtrar peças pendentes para o fornecedor (simulação)
    // Em um sistema real, filtraria por email do fornecedor logado
    const pendingParts = partsDatabase.filter(p => p.status === 'pending');
    
    // Atualizar contador
    if (pendingCount) {
        pendingCount.textContent = pendingParts.length;
    }
    
    if (pendingParts.length === 0) {
        supplierList.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Nenhuma pendência</strong>
                    <p>Todas as solicitações foram respondidas</p>
                </div>
            </div>
        `;
        return;
    }
    
    supplierList.innerHTML = pendingParts.map(part => {
        const dueDate = new Date(part.dueDate);
        const today = new Date();
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        const isUrgent = daysLeft <= 3;
        
        return `
        <div class="part-item pending ${isUrgent ? 'urgent' : ''}">
            <div class="part-header">
                <div class="part-title">${part.partNumber} - ${part.partDescription}</div>
                <div class="part-status status-pending">
                    ${isUrgent ? 'URGENTE' : 'PENDENTE'} - ${daysLeft} dias restantes
                </div>
            </div>
            <div class="part-details">
                <div class="detail-item">
                    <i class="fas fa-boxes"></i>
                    <span>Volume Contratado: ${part.contractedVolume}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-chart-line"></i>
                    <span>Volume/Semana: ${part.weeklyVolume}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Prazo: ${dueDate.toLocaleDateString('pt-BR')}</span>
                </div>
            </div>
            <div class="part-actions">
                <button class="action-btn primary" onclick="openMilestoneModal('${part.id}')">
                    <i class="fas fa-edit"></i> Preencher Prazos
                </button>
            </div>
        </div>
        `;
    }).join('');
}

function updateCounters() {
    const pendingCount = document.getElementById('pending-count');
    if (pendingCount) {
        const count = partsDatabase.filter(p => p.status === 'completed').length;
        pendingCount.textContent = count;
    }
}

function approvePart(partId) {
    if (confirm('Deseja aprovar os prazos definidos pelo fornecedor?')) {
        const partIndex = partsDatabase.findIndex(p => p.id === partId);
        if (partIndex !== -1) {
            partsDatabase[partIndex].status = 'approved';
            partsDatabase[partIndex].approvedDate = new Date().toISOString();
            localStorage.setItem('apqp_parts', JSON.stringify(partsDatabase));
            
            // Atualizar listas
            updatePendingList();
            updateAllPartsList();
            updateCounters();
            
            alert('Peça aprovada com sucesso!');
        }
    }
}

function requestChanges(partId) {
    const part = partsDatabase.find(p => p.id === partId);
    if (!part) return;
    
    const message = prompt('Descreva as alterações necessárias:');
    if (message) {
        // Em um sistema real, enviaria email para o fornecedor
        alert('Solicitação de alteração enviada para o fornecedor.');
        
        // Mudar status para pending novamente
        const partIndex = partsDatabase.findIndex(p => p.id === partId);
        partsDatabase[partIndex].status = 'pending';
        localStorage.setItem('apqp_parts', JSON.stringify(partsDatabase));
        
        // Atualizar listas
        updatePendingList();
        updateAllPartsList();
        updateCounters();
    }
}

function remindSupplier(partId) {
    const part = partsDatabase.find(p => p.id === partId);
    if (!part) return;
    
    // Simular envio de email
    sendReminderEmail(part);
    alert('Lembrete enviado para o fornecedor!');
}

function sendEmailToSupplier(partData) {
    console.log(`Email simulado enviado para: ${partData.supplierEmail}`);
    console.log('Assunto: Solicitação de preenchimento de prazos APQP');
    console.log(`Mensagem: Prezado fornecedor, por favor preencha os prazos para a peça ${partData.partNumber} em até ${partData.dueWeeks} semanas.`);
    console.log(`Link: http://seusite.com/supplier.html?part=${partData.id}`);
}

function sendEmailToManager(partData) {
    console.log(`Email simulado enviado para o gestor`);
    console.log('Assunto: Fornecedor preencheu prazos APQP');
    console.log(`Mensagem: O fornecedor preencheu os prazos para a peça ${partData.partNumber}. Por favor valide.`);
}

function sendReminderEmail(partData) {
    console.log(`Email de lembrete enviado para: ${partData.supplierEmail}`);
    console.log('Assunto: Lembrete - Prazos APQP Pendentes');
    console.log(`Mensagem: Lembrete: A peça ${partData.partNumber} ainda está pendente de preenchimento.`);
}

// Funções auxiliares para navegação entre abas
function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    
    // Encontrar o botão correspondente
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(tabName) || 
            (tabName === 'register' && btn.textContent.toLowerCase().includes('nova'))) {
            btn.classList.add('active');
        }
    });
}