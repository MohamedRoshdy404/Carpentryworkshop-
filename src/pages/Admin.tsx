import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { categories, normalizeProductCategory } from "../data/products";
import { useProductCatalog } from "../contexts/useProductCatalog";
import type { Product, ProductAvailability, ProductImage } from "../types/product";
import { isSupabaseConfigured, supabase } from "../services/supabase";

type ManagedProduct = Product & { published: boolean };

type ProductForm = {
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  price: string;
  oldPrice: string;
  dimensions: string;
  materials: string;
  colors: string;
  availability: ProductAvailability;
  estimatedTime: string;
  notes: string;
  customizable: boolean;
  featured: boolean;
  published: boolean;
  images: ProductImage[];
};

const emptyForm = (): ProductForm => ({
  name: "",
  slug: `product-${Date.now()}`,
  category: categories[0]?.name ?? "",
  shortDescription: "",
  description: "",
  price: "",
  oldPrice: "",
  dimensions: "",
  materials: "",
  colors: "",
  availability: "available",
  estimatedTime: "",
  notes: "",
  customizable: true,
  featured: false,
  published: true,
  images: [],
});

function messageFrom(error: unknown): string {
  return error instanceof Error ? error.message : "حدث خطأ غير متوقع.";
}

function splitValues(value: string): string[] {
  return value
    .split(/[,،]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { refresh: refreshPublicCatalog } = useProductCatalog();

  const loadProducts = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("products")
      .select("id, product, is_published")
      .order("id", { ascending: false });

    if (error) throw new Error(`تعذر تحميل منتجات لوحة الإدارة: ${error.message}`);
    setProducts(
      (data ?? []).map((row) => ({
        ...(row.product as Omit<Product, "id">),
        id: Number(row.id),
        published: row.is_published,
        category: normalizeProductCategory(row.product.category),
      })),
    );
  }, []);

  const checkAdmin = useCallback(async (currentUser: User | null) => {
    setUser(currentUser);
    setIsAdmin(false);
    if (!currentUser || !supabase) return;

    const { data, error } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    if (error) {
      setErrorMessage(`تعذر التحقق من صلاحيات الإدارة: ${error.message}`);
      return;
    }
    setIsAdmin(Boolean(data));
    if (!data) {
      setErrorMessage("هذا الحساب غير مصرح له بإدارة المنتجات.");
      return;
    }

    try {
      await loadProducts();
      setErrorMessage("");
    } catch (loadError) {
      setErrorMessage(messageFrom(loadError));
    }
  }, [loadProducts]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      void checkAdmin(session?.user ?? null);
      setCheckingSession(false);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) setErrorMessage(`تعذر استعادة جلسة الدخول: ${error.message}`);
      void checkAdmin(data.session?.user ?? null);
      setCheckingSession(false);
    });

    return () => authListener.subscription.unsubscribe();
  }, [checkAdmin]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErrorMessage(`تعذر تسجيل الدخول: ${error.message}`);
    setBusy(false);
  };

  const startEditing = (product: ManagedProduct) => {
    setEditingId(product.id);
    setSelectedImages([]);
    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      shortDescription: product.shortDescription,
      description: product.description,
      price: String(product.price),
      oldPrice: product.oldPrice === undefined ? "" : String(product.oldPrice),
      dimensions: product.dimensions,
      materials: product.materials.join("، "),
      colors: product.colors.join("، "),
      availability: product.availability,
      estimatedTime: product.estimatedTime ?? "",
      notes: product.notes ?? "",
      customizable: product.customizable,
      featured: product.featured,
      published: product.published,
      images: product.images,
    });
    setNotice("");
    setErrorMessage("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setSelectedImages([]);
    setForm(emptyForm());
    setErrorMessage("");
    setNotice("");
  };

  const uploadImages = async (): Promise<ProductImage[]> => {
    if (!supabase) throw new Error("إعداد Supabase غير مكتمل.");
    if (selectedImages.length === 0) return form.images;

    const uploaded: ProductImage[] = [];
    for (const file of selectedImages) {
      if (!file.type.startsWith("image/")) {
        throw new Error(`الملف ${file.name} ليس صورة صالحة.`);
      }

      const safeName = file.name.replace(/[^\w.-]/g, "-");
      const path = `${crypto.randomUUID()}-${safeName}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (error) throw new Error(`تعذر رفع الصورة ${file.name}: ${error.message}`);
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      uploaded.push({ src: data.publicUrl, alt: form.name });
    }
    return uploaded;
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;

    const price = Number(form.price);
    const oldPrice = form.oldPrice ? Number(form.oldPrice) : undefined;
    const slug = form.slug.trim().toLowerCase();
    if (!form.name.trim() || !slug || !Number.isFinite(price) || price <= 0) {
      setErrorMessage("أدخل اسم المنتج ورابطًا مختصرًا صالحًا وسعرًا أكبر من صفر.");
      return;
    }
    if (oldPrice !== undefined && (!Number.isFinite(oldPrice) || oldPrice <= price)) {
      setErrorMessage("السعر قبل الخصم يجب أن يكون أكبر من السعر الحالي.");
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setErrorMessage("الرابط المختصر يقبل الحروف الإنجليزية الصغيرة والأرقام والواصلات فقط.");
      return;
    }

    setBusy(true);
    setErrorMessage("");
    setNotice("");
    try {
      const images = await uploadImages();
      if (images.length === 0) {
        throw new Error("أضف صورة واحدة على الأقل للمنتج.");
      }
      const product = {
        name: form.name.trim(),
        slug,
        category: form.category,
        shortDescription: form.shortDescription.trim() || form.name.trim(),
        description: form.description.trim() || form.shortDescription.trim() || form.name.trim(),
        price,
        ...(oldPrice && Number.isFinite(oldPrice) ? { oldPrice } : {}),
        ...(oldPrice && Number.isFinite(oldPrice) && oldPrice > price
          ? { discount: Math.round(((oldPrice - price) / oldPrice) * 100) }
          : {}),
        images: images.map((image) => ({ ...image, alt: form.name.trim() })),
        materials: splitValues(form.materials),
        dimensions: form.dimensions.trim() || "تُحدد عند الاستفسار",
        colors: splitValues(form.colors),
        availability: form.availability,
        customizable: form.customizable,
        featured: form.featured,
        createdAt: editingId
          ? products.find((item) => item.id === editingId)?.createdAt ?? new Date().toISOString()
          : new Date().toISOString(),
        estimatedTime: form.estimatedTime.trim() || undefined,
        notes: form.notes.trim() || undefined,
      };

      const result = editingId
        ? await supabase
            .from("products")
            .update({ slug, product, is_published: form.published })
            .eq("id", editingId)
        : await supabase
            .from("products")
            .insert({ slug, product, is_published: form.published });

      if (result.error) throw new Error(`تعذر حفظ المنتج: ${result.error.message}`);
      await loadProducts();
      await refreshPublicCatalog();
      cancelEditing();
      setNotice(editingId ? "تم تحديث المنتج." : "تمت إضافة المنتج بنجاح.");
    } catch (saveError) {
      setErrorMessage(messageFrom(saveError));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (product: ManagedProduct) => {
    if (!supabase || !window.confirm(`هل تريد حذف «${product.name}» نهائيًا؟`)) return;
    setBusy(true);
    setErrorMessage("");
    try {
      const { error } = await supabase.from("products").delete().eq("id", product.id);
      if (error) throw new Error(`تعذر حذف المنتج: ${error.message}`);
      await loadProducts();
      await refreshPublicCatalog();
      if (editingId === product.id) cancelEditing();
      setNotice("تم حذف المنتج.");
    } catch (deleteError) {
      setErrorMessage(messageFrom(deleteError));
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setErrorMessage(`تعذر تسجيل الخروج: ${error.message}`);
  };

  if (!isSupabaseConfigured || !supabase) {
    return (
      <AdminShell>
        <h1 className="text-3xl font-black text-stone-900">لوحة إدارة المنتجات</h1>
        <p className="mt-4 leading-8 text-stone-700">
          لإتاحة اللوحة، أضف رابط Supabase والمفتاح العام إلى ملف البيئة ثم أعد تشغيل الموقع.
        </p>
        <p className="mt-2 text-sm text-stone-500">
          انسخ .env.example إلى .env.local واتبع خطوات الإعداد في README.
        </p>
      </AdminShell>
    );
  }

  if (checkingSession) {
    return <AdminShell><p role="status">جارٍ التحقق من تسجيل الدخول...</p></AdminShell>;
  }

  if (!user) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-black text-stone-900">دخول الإدارة</h1>
          <p className="mt-3 leading-7 text-stone-600">سجّل الدخول بحساب الإدارة الذي أنشأته في Supabase.</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-stone-700">
              البريد الإلكتروني
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              كلمة المرور
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
              />
            </label>
            {errorMessage ? <p role="alert" className="text-sm text-red-700">{errorMessage}</p> : null}
            <button disabled={busy} className="w-full rounded-full bg-stone-900 px-5 py-3 font-semibold text-white disabled:opacity-60">
              {busy ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </AdminShell>
    );
  }

  if (!isAdmin) {
    return (
      <AdminShell>
        <h1 className="text-3xl font-black text-stone-900">لا توجد صلاحية إدارة</h1>
        <p role="alert" className="mt-4 text-red-700">
          {errorMessage || "الحساب مسجل، لكنه غير مضاف إلى قائمة مديري الكتالوج."}
        </p>
        <button type="button" onClick={() => void handleLogout()} className="mt-5 rounded-full border px-5 py-3">
          تسجيل الخروج
        </button>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-stone-500">{user.email}</p>
          <h1 className="mt-1 text-3xl font-black text-stone-900">إدارة المنتجات</h1>
        </div>
        <button type="button" onClick={() => void handleLogout()} className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm">
          تسجيل الخروج
        </button>
      </div>
      <p className="mt-3 text-sm leading-7 text-stone-600">
        المنتجات المضافة هنا تُحفظ في قاعدة البيانات وتظهر للزوار مباشرة. المنتجات القديمة في ملف البيانات تظل كما هي.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-stone-900">{editingId ? "تعديل المنتج" : "إضافة منتج"}</h2>
            {editingId ? <button type="button" onClick={cancelEditing} className="text-sm text-stone-600">إلغاء التعديل</button> : null}
          </div>

          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <Field label="اسم المنتج" required value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
            <Field label="رابط المنتج بالإنجليزية" required value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} />
            <label className="block text-sm font-medium text-stone-700">
              التصنيف
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-3">
                {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Field label="السعر بالجنيه" required type="number" min="1" value={form.price} onChange={(value) => setForm({ ...form, price: value })} />
              <Field label="السعر قبل الخصم" type="number" min="1" value={form.oldPrice} onChange={(value) => setForm({ ...form, oldPrice: value })} />
            </div>
            <Field label="وصف قصير" value={form.shortDescription} onChange={(value) => setForm({ ...form, shortDescription: value })} />
            <TextArea label="الوصف الكامل" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
            <label className="block text-sm font-medium text-stone-700">
              صور المنتج (يمكن اختيار عدة صور لنفس القطعة من زوايا مختلفة)
              {editingId && form.images.length ? " — استبدال الصور الحالية" : ""}
              <input type="file" accept="image/*" multiple onChange={(event) => setSelectedImages(Array.from(event.target.files ?? []))} className="mt-2 block w-full text-sm file:ml-3 file:rounded-full file:border-0 file:bg-stone-100 file:px-4 file:py-2" />
            </label>
            <p className="text-xs leading-5 text-stone-500">
              ارفع صورًا حقيقية لنفس القطعة من الأمام والجنب والتفاصيل. الصور الحالية ستُستبدل عند اختيار صور جديدة.
            </p>
            {form.images.length ? (
              <p className="text-xs text-stone-500">الصور الحالية: {form.images.length}</p>
            ) : null}
            <Field label="الخامات (افصل بينها بفاصلة)" value={form.materials} onChange={(value) => setForm({ ...form, materials: value })} />
            <Field label="الألوان المتاحة (افصل بينها بفاصلة)" value={form.colors} onChange={(value) => setForm({ ...form, colors: value })} />
            <Field label="الأبعاد" value={form.dimensions} onChange={(value) => setForm({ ...form, dimensions: value })} />
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium text-stone-700">
                حالة المنتج
                <select value={form.availability} onChange={(event) => setForm({ ...form, availability: event.target.value as ProductAvailability })} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-3">
                  <option value="available">متاح للتنفيذ</option>
                  <option value="custom">حسب الطلب</option>
                  <option value="unavailable">غير متاح مؤقتًا</option>
                </select>
              </label>
              <Field label="مدة التنفيذ" value={form.estimatedTime} onChange={(value) => setForm({ ...form, estimatedTime: value })} />
            </div>
            <Field label="ملاحظات" value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} />
            <div className="space-y-2 text-sm text-stone-700">
              <Toggle label="قابل للتخصيص حسب الطلب" checked={form.customizable} onChange={(value) => setForm({ ...form, customizable: value })} />
              <Toggle label="منتج مميز في الصفحة الرئيسية" checked={form.featured} onChange={(value) => setForm({ ...form, featured: value })} />
              <Toggle label="منشور للزوار" checked={form.published} onChange={(value) => setForm({ ...form, published: value })} />
            </div>
            {errorMessage ? <p role="alert" className="text-sm leading-6 text-red-700">{errorMessage}</p> : null}
            {notice ? <p role="status" className="text-sm text-green-700">{notice}</p> : null}
            <button disabled={busy} className="w-full rounded-full bg-stone-900 px-5 py-3 font-semibold text-white disabled:opacity-60">
              {busy ? "جارٍ الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة المنتج"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-stone-900">المنتجات التي تديرها اللوحة ({products.length})</h2>
          {products.length ? (
            <ul className="space-y-3">
              {products.map((product) => (
                <li key={product.id} className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
                  <img src={product.images[0]?.src} alt="" className="h-20 w-24 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-stone-900">{product.name}</p>
                    <p className="mt-1 text-sm text-stone-600">{product.price.toLocaleString("ar-EG")} جنيه · {product.category}</p>
                    <p className="mt-1 text-xs text-stone-500">{product.published ? "منشور" : "مسودة"}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <button type="button" onClick={() => startEditing(product)} className="rounded-full border px-3 py-1.5">تعديل</button>
                    <button type="button" disabled={busy} onClick={() => void handleDelete(product)} className="rounded-full border border-red-200 px-3 py-1.5 text-red-700 disabled:opacity-50">حذف</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center leading-7 text-stone-600">
              لم تضف منتجات من هذه اللوحة بعد. المنتجات الحالية في الكتالوج تظل ظاهرة للزوار.
            </p>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
      <div className="mb-8 text-right">
        <Link to="/" className="text-sm text-stone-600 hover:text-stone-900">العودة للموقع</Link>
      </div>
      <div className="text-right">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      <input type={type} min={min} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-3" />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      <textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-3" />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl bg-stone-50 px-3 py-2.5">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
